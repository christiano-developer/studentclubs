"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { FaGoogle, FaLock } from "react-icons/fa";
import Image from "next/image";

const AuthPage: React.FC = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const { settings, loading: settingsLoading } = useAppSettings();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading && !settingsLoading) {
      if (user.isRegistered) {
        router.push("/dashboard");
      } else if (settings?.allowUserRegistration) {
        // Only redirect to register if registration is enabled
        router.push("/register");
      }
      // If registration is disabled, stay on auth page and show disabled message
    }
  }, [user, loading, router, settings, settingsLoading]);

  const handleGoogleSignIn = async () => {
    // Check if registration is allowed
    if (!settings?.allowUserRegistration) {
      return; // Don't proceed if registration is disabled
    }

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading..." : "Loading settings..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 bg-black/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center">
      <div className="max-w-md w-full">
        <div className="">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to <br className="lg:hidden "></br>org
            </h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="mb-8">
            <Image
              width={100}
              height={100}
              src="/logos/org_SB_TransC.png"
              alt="org  Logo"
              className="mx-auto h-20 w-auto"
            />
          </div>

          {settings?.allowUserRegistration ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm"
              >
                <FaGoogle className="text-red-500 text-xl" />
                Sign in with Google
              </button>

              <p className="mt-6 text-sm text-gray-500">
                New user? You will be redirected to complete your registration
                after signing in.
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
                <FaLock className="mx-auto text-red-500 text-3xl mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Registration Currently Disabled
                </h3>
                <p className="text-red-700 text-sm">
                  New user registration is temporarily unavailable. Please check
                  back later or contact the administrator for assistance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
