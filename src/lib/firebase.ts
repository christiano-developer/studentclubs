import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  deleteDoc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  ContactMessage,
  ContactFormData,
  ContactStatus,
  CustomForm,
  FormBuilderData,
  FormSubmission,
  FormSubmissionData,
  FormStatus,
  AppSettings,
  AppSettingsUpdate,
} from "@/types/auth";
import { organizationConfig } from "@/config/organization";

// Check if static mode is enabled
const isStaticMode = organizationConfig.features.enableStaticMode;

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigComplete = !isStaticMode && Object.values(firebaseConfig).every(value => value && value !== 'undefined');

// Initialize Firebase only if not in static mode and config is complete
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigComplete) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

// Export Firebase instances (can be null in static mode)
export { auth, db, storage, googleProvider };

// Export static mode flag
export const isFirebaseEnabled = !isStaticMode && isFirebaseConfigComplete;

// Contact Message Functions
export const submitContactMessage = async (
  formData: ContactFormData,
): Promise<string> => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase is not enabled or not configured. Contact form is not available in static mode.");
  }
  
  try {
    const docRef = await addDoc(collection(db, "contact_messages"), {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      createdAt: new Date(),
      status: ContactStatus.UNREAD,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting contact message:", error);
    throw error;
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (!isFirebaseEnabled || !db) {
    return [];
  }
  
  try {
    const q = query(
      collection(db, "contact_messages"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: data.createdAt?.toDate() || data.createdAt,
        status: data.status,
        readAt: data.readAt?.toDate() || data.readAt,
        resolvedAt: data.resolvedAt?.toDate() || data.resolvedAt,
        resolvedBy: data.resolvedBy,
      });
    });

    return messages;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
};

export const updateContactMessageStatus = async (
  messageId: string,
  status: ContactStatus,
  adminId?: string,
): Promise<void> => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase is not enabled or not configured. Cannot update contact message status in static mode.");
  }
  
  try {
    const updateData: {
      status: ContactStatus;
      updatedAt: Date;
      readAt?: Date;
      resolvedAt?: Date;
      resolvedBy?: string;
    } = {
      status,
      updatedAt: new Date(),
    };

    if (status === ContactStatus.READ && !updateData.readAt) {
      updateData.readAt = new Date();
    }

    if (status === ContactStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
      if (adminId) {
        updateData.resolvedBy = adminId;
      }
    }

    await updateDoc(doc(db, "contact_messages", messageId), updateData);
  } catch (error) {
    console.error("Error updating contact message status:", error);
    throw error;
  }
};

// Organization ID validation functions
export const checkorgIdExists = async (
  orgId: string,
  excludeUserId?: string,
): Promise<boolean> => {
  if (!isFirebaseEnabled || !db) {
    return false;
  }
  
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("registrationData.orgId", "==", orgId));
    const querySnapshot = await getDocs(q);

    if (excludeUserId) {
      return querySnapshot.docs.some((doc) => doc.id !== excludeUserId);
    }

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking Organization ID existence:", error);
    throw error;
  }
};

// Custom Forms Functions
export const createForm = async (
  formData: FormBuilderData,
  createdBy: string,
): Promise<string> => {
  try {
    const customFields = formData.customFields.map((field, index) => ({
      ...field,
      id: `field_${Date.now()}_${index}`,
      order: index,
    }));

    const docRef = await addDoc(collection(db, "forms"), {
      title: formData.title,
      description: formData.description,
      status: FormStatus.ACTIVE,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      customFields,
      submissions: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

export const updateForm = async (
  formId: string,
  formData: FormBuilderData,
  existingForm?: CustomForm,
): Promise<void> => {
  try {
    let customFields;

    if (existingForm) {
      // Preserve existing field IDs when updating
      customFields = formData.customFields.map((field, index) => {
        const existingField = existingForm.customFields.find(
          (existing) =>
            existing.order === field.order && existing.label === field.label,
        );
        return {
          ...field,
          id: existingField?.id || `field_${Date.now()}_${index}`,
          order: index,
        };
      });
    } else {
      // Create new IDs for all fields
      customFields = formData.customFields.map((field, index) => ({
        ...field,
        id: `field_${Date.now()}_${index}`,
        order: index,
      }));
    }

    await updateDoc(doc(db, "forms", formId), {
      title: formData.title,
      description: formData.description,
      customFields,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating form:", error);
    throw error;
  }
};

export const updateFormStatus = async (
  formId: string,
  status: FormStatus,
): Promise<void> => {
  try {
    await updateDoc(doc(db, "forms", formId), {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating form status:", error);
    throw error;
  }
};

export const deleteForm = async (formId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "forms", formId));
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
};

export const getActiveForms = async (): Promise<CustomForm[]> => {
  try {
    const q = query(
      collection(db, "forms"),
      where("status", "==", FormStatus.ACTIVE),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const forms: CustomForm[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      forms.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        status: data.status,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || data.createdAt,
        updatedAt: data.updatedAt?.toDate() || data.updatedAt,
        customFields: data.customFields || [],
        submissions: data.submissions || 0,
      });
    });

    return forms;
  } catch (error) {
    console.error("Error fetching active forms:", error);
    throw error;
  }
};

export const getAllForms = async (): Promise<CustomForm[]> => {
  try {
    const q = query(collection(db, "forms"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const forms: CustomForm[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      forms.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        status: data.status,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || data.createdAt,
        updatedAt: data.updatedAt?.toDate() || data.updatedAt,
        customFields: data.customFields || [],
        submissions: data.submissions || 0,
      });
    });

    return forms;
  } catch (error) {
    console.error("Error fetching all forms:", error);
    throw error;
  }
};

export const getFormById = async (
  formId: string,
): Promise<CustomForm | null> => {
  try {
    const docRef = doc(db, "forms", formId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        status: data.status,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || data.createdAt,
        updatedAt: data.updatedAt?.toDate() || data.updatedAt,
        customFields: data.customFields || [],
        submissions: data.submissions || 0,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    throw error;
  }
};

export const submitForm = async (
  formId: string,
  userId: string,
  submissionData: FormSubmissionData,
  allowResubmission: boolean = false,
): Promise<string> => {
  try {
    // Check if user already submitted this form
    const existingSubmissionQuery = query(
      collection(db, "form_submissions"),
      where("formId", "==", formId),
      where("userId", "==", userId),
    );
    const existingSubmission = await getDocs(existingSubmissionQuery);

    if (!existingSubmission.empty && !allowResubmission) {
      throw new Error("You have already submitted this form");
    }

    let docRef;
    let isUpdate = false;

    if (!existingSubmission.empty && allowResubmission) {
      // Update existing submission
      const existingDoc = existingSubmission.docs[0];
      await updateDoc(existingDoc.ref, {
        ...submissionData,
        submittedAt: new Date(),
      });
      docRef = { id: existingDoc.id };
      isUpdate = true;
    } else {
      // Create new submission
      docRef = await addDoc(collection(db, "form_submissions"), {
        formId,
        userId,
        ...submissionData,
        submittedAt: new Date(),
      });
    }

    // Update form submission count only for new submissions
    if (!isUpdate) {
      const formRef = doc(db, "forms", formId);
      const formDoc = await getDoc(formRef);
      if (formDoc.exists()) {
        const currentSubmissions = formDoc.data().submissions || 0;
        await updateDoc(formRef, {
          submissions: currentSubmissions + 1,
        });
      }
    }

    return docRef.id;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const checkUserFormSubmission = async (
  formId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "form_submissions"),
      where("formId", "==", formId),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking user form submission:", error);
    throw error;
  }
};

export const getUserFormSubmission = async (
  formId: string,
  userId: string,
): Promise<FormSubmission | null> => {
  try {
    const q = query(
      collection(db, "form_submissions"),
      where("formId", "==", formId),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      formId: data.formId,
      userId: data.userId,
      name: data.name,
      email: data.email || "", // Handle existing submissions without email
      branch: data.branch,
      yearOfStudy: data.yearOfStudy,
      orgId: data.orgId,
      phoneNumber: data.phoneNumber,
      agreedToTerms: data.agreedToTerms,
      customResponses: data.customResponses || {},
      submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
    };
  } catch (error) {
    console.error("Error fetching user form submission:", error);
    throw error;
  }
};

export const getFormSubmissions = async (
  formId: string,
): Promise<FormSubmission[]> => {
  try {
    const q = query(
      collection(db, "form_submissions"),
      where("formId", "==", formId),
      orderBy("submittedAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const submissions: FormSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        formId: data.formId,
        userId: data.userId,
        name: data.name,
        email: data.email || "", // Handle existing submissions without email
        branch: data.branch,
        yearOfStudy: data.yearOfStudy,
        orgId: data.orgId,
        phoneNumber: data.phoneNumber,
        agreedToTerms: data.agreedToTerms,
        customResponses: data.customResponses || {},
        submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
      });
    });

    return submissions;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw error;
  }
};

// App Settings Functions
export const getAppSettings = async (): Promise<AppSettings | null> => {
  if (!isFirebaseEnabled || !db) {
    // Return default settings for static mode
    return {
      id: "static_default",
      alloworgIdEdits: false,
      allowUserRegistration: false,
      allowContactForm: false,
      allowPublicFormAccess: false,
      maintenanceMode: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "static_mode",
    };
  }
  
  try {
    const settingsRef = collection(db, "app_settings");
    const q = query(settingsRef);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Return default settings if none exist
      return {
        id: "default",
        alloworgIdEdits: false,
        allowUserRegistration: true,
        allowContactForm: true,
        allowPublicFormAccess: true,
        maintenanceMode: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: "system",
      };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      alloworgIdEdits: data.alloworgIdEdits ?? false,
      allowUserRegistration: data.allowUserRegistration ?? true,
      allowContactForm: data.allowContactForm ?? true,
      allowPublicFormAccess: data.allowPublicFormAccess ?? true,
      maintenanceMode: data.maintenanceMode ?? false,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      updatedBy: data.updatedBy || "system",
    };
  } catch (error) {
    console.error("Error fetching app settings:", error);
    throw error;
  }
};

export const updateAppSettings = async (
  updates: AppSettingsUpdate,
  adminId: string,
): Promise<void> => {
  try {
    const settingsRef = collection(db, "app_settings");
    const q = query(settingsRef);
    const querySnapshot = await getDocs(q);

    const updateData = {
      ...updates,
      updatedAt: new Date(),
      updatedBy: adminId,
    };

    if (querySnapshot.empty) {
      // Create new settings document
      await addDoc(settingsRef, {
        alloworgIdEdits: false,
        allowUserRegistration: true,
        allowContactForm: true,
        allowPublicFormAccess: true,
        maintenanceMode: false,
        createdAt: new Date(),
        ...updateData,
      });
    } else {
      // Update existing settings
      const settingsDoc = querySnapshot.docs[0];
      await updateDoc(settingsDoc.ref, updateData);
    }
  } catch (error) {
    console.error("Error updating app settings:", error);
    throw error;
  }
};

export const initializeAppSettings = async (adminId: string): Promise<void> => {
  try {
    const settingsRef = collection(db, "app_settings");
    const q = query(settingsRef);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(settingsRef, {
        alloworgIdEdits: false,
        allowUserRegistration: true,
        allowContactForm: true,
        allowPublicFormAccess: true,
        maintenanceMode: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: adminId,
      });
    }
  } catch (error) {
    console.error("Error initializing app settings:", error);
    throw error;
  }
};
