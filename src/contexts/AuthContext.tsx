"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseEnabled } from "@/lib/firebase";
import { User, UserRegistration, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      // Static mode: no authentication
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db!, "users", firebaseUser.uid));

            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Convert Firestore Timestamps to Date objects
              let registrationData = userData.registrationData;
              if (registrationData) {
                registrationData = {
                  ...registrationData,
                  createdAt:
                    registrationData.createdAt?.toDate?.() ||
                    registrationData.createdAt,
                  updatedAt:
                    registrationData.updatedAt?.toDate?.() ||
                    registrationData.updatedAt,
                  validatedAt:
                    registrationData.validatedAt?.toDate?.() ||
                    registrationData.validatedAt,
                };
              }

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName!,
                photoURL: firebaseUser.photoURL || undefined,
                isRegistered: userData.isRegistered || false,
                isAdmin: userData.isAdmin || false,
                registrationData,
              });
            } else {
              const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName!,
                photoURL: firebaseUser.photoURL || undefined,
                isRegistered: false,
                isAdmin: false,
              };

              await setDoc(doc(db!, "users", firebaseUser.uid), {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                isRegistered: false,
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              });

              setUser(newUser);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseEnabled || !auth || !googleProvider) {
      throw new Error("Authentication is not available in static mode");
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!isFirebaseEnabled || !auth) {
      throw new Error("Authentication is not available in static mode");
    }
    
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserRegistration = async (registrationData: UserRegistration) => {
    if (!isFirebaseEnabled || !db) {
      throw new Error("User registration is not available in static mode");
    }
    
    if (!user) throw new Error("No user authenticated");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        registrationData,
        isRegistered: true,
        updatedAt: new Date(),
      });

      setUser({
        ...user,
        isRegistered: true,
        registrationData,
      });
    } catch (error) {
      console.error("Error updating user registration:", error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserRegistration>) => {
    if (!isFirebaseEnabled || !db) {
      throw new Error("User profile updates are not available in static mode");
    }
    
    if (!user || !user.registrationData)
      throw new Error("No user authenticated or registered");

    try {
      const updatedRegistrationData = {
        ...user.registrationData,
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, "users", user.uid), {
        registrationData: updatedRegistrationData,
        updatedAt: new Date(),
      });

      setUser({
        ...user,
        registrationData: updatedRegistrationData,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    updateUserRegistration,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
