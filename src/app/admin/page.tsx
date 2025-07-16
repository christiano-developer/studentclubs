"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import {
  db,
  getContactMessages,
  updateContactMessageStatus,
  getAllForms,
  createForm,
  updateForm,
  updateFormStatus,
  deleteForm,
  getFormSubmissions,
  getAppSettings,
  initializeAppSettings,
} from "@/lib/firebase";
import {
  UserRegistration,
  ValidationStatus,
  ContactMessage,
  ContactStatus,
  CustomForm,
  FormBuilderData,
  FormStatus,
  FormSubmission,
  AppSettings,
} from "@/types/auth";

import ContactModal from "@/components/ContactModal";
import UserModal from "@/components/UserModal";
import FormBuilderModal from "@/components/FormBuilderModal";
import AdminHeader from "./_components/AdminHeader";
import AdminTabs, { AdminTab } from "./_components/AdminTabs";
import StatsCards from "./_components/StatsCards";
import UserManagementSection from "./_components/UserManagement/UserManagementSection";
import ContactManagementSection from "./_components/ContactManagement/ContactManagementSection";
import FormsManagementSection from "./_components/FormsManagement/FormsManagementSection";
import FormSubmissionsModal from "./_components/FormsManagement/FormSubmissionsModal";
import SettingsManagementSection from "./_components/SettingsManagement/SettingsManagementSection";

interface UserWithId extends UserRegistration {
  id: string;
}

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(
    null,
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [validatedByName, setValidatedByName] = useState<string>("");

  // Forms related state
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [isUpdatingForm, setIsUpdatingForm] = useState(false);

  // Form submissions modal state
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedFormForSubmissions, setSelectedFormForSubmissions] =
    useState<CustomForm | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [contactStats, setContactStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    resolved: 0,
  });
  const [formStats, setFormStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalSubmissions: 0,
  });

  // Refresh states
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [isRefreshingContacts, setIsRefreshingContacts] = useState(false);
  const [isRefreshingForms, setIsRefreshingForms] = useState(false);
  const [isRefreshingSettings, setIsRefreshingSettings] = useState(false);

  // Settings state
  const [_settings, setSettings] = useState<AppSettings | null>(null);
  const [_loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
      fetchContactMessages();
      fetchForms();
      fetchSettings();
      initializeAppSettings(user.uid);
    }
  }, [user]);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingUsers(true);
      } else {
        setLoadingUsers(true);
      }
      const usersQuery = query(
        collection(db, "users"),
        where("isRegistered", "==", true),
        orderBy("registrationData.createdAt", "desc"),
      );

      const querySnapshot = await getDocs(usersQuery);
      const usersData: UserWithId[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.registrationData) {
          usersData.push({
            id: doc.id,
            ...data.registrationData,
            createdAt:
              data.registrationData.createdAt?.toDate?.() ||
              data.registrationData.createdAt,
            updatedAt:
              data.registrationData.updatedAt?.toDate?.() ||
              data.registrationData.updatedAt,
            validatedAt:
              data.registrationData.validatedAt?.toDate?.() ||
              data.registrationData.validatedAt,
          });
        }
      });

      setUsers(usersData);

      const statsData = {
        total: usersData.length,
        pending: usersData.filter(
          (u) => u.validationStatus === ValidationStatus.PENDING,
        ).length,
        approved: usersData.filter(
          (u) => u.validationStatus === ValidationStatus.APPROVED,
        ).length,
        rejected: usersData.filter(
          (u) => u.validationStatus === ValidationStatus.REJECTED,
        ).length,
      };

      setStats(statsData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
      setIsRefreshingUsers(false);
    }
  };

  const fetchValidatedByName = async (adminId: string) => {
    try {
      const adminDoc = await getDoc(doc(db, "users", adminId));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        setValidatedByName(
          adminData.displayName || adminData.email || "Unknown Admin",
        );
      }
    } catch (error) {
      console.error("Error fetching admin name:", error);
      setValidatedByName("Unknown Admin");
    }
  };

  const handleValidateUser = async (
    userId: string,
    status: ValidationStatus,
  ) => {
    try {
      setIsUpdatingUser(true);
      await updateDoc(doc(db, "users", userId), {
        "registrationData.validationStatus": status,
        "registrationData.validatedBy": user?.uid,
        "registrationData.validatedAt": new Date(),
        "registrationData.updatedAt": new Date(),
      });

      await fetchUsers();

      // Update the selected user if it's the same one being updated
      if (selectedUser?.id === userId) {
        const updatedUser = users.find((u) => u.id === userId);
        if (updatedUser) {
          setSelectedUser({ ...updatedUser, validationStatus: status });
        }
      }
    } catch (error) {
      console.error("Error validating user:", error);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const fetchContactMessages = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingContacts(true);
      } else {
        setLoadingContacts(true);
      }
      const messages = await getContactMessages();
      setContactMessages(messages);

      const contactStatsData = {
        total: messages.length,
        unread: messages.filter((m) => m.status === ContactStatus.UNREAD)
          .length,
        read: messages.filter((m) => m.status === ContactStatus.READ).length,
        resolved: messages.filter((m) => m.status === ContactStatus.RESOLVED)
          .length,
      };

      setContactStats(contactStatsData);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoadingContacts(false);
      setIsRefreshingContacts(false);
    }
  };

  const handleContactStatusUpdate = async (
    messageId: string,
    status: ContactStatus,
  ) => {
    try {
      setIsUpdatingContact(true);
      await updateContactMessageStatus(messageId, status, user?.uid);
      await fetchContactMessages();

      if (selectedContact?.id === messageId) {
        const updatedMessage = contactMessages.find((m) => m.id === messageId);
        if (updatedMessage) {
          setSelectedContact({ ...updatedMessage, status });
        }
      }
    } catch (error) {
      console.error("Failed to update contact message status:", error);
    } finally {
      setIsUpdatingContact(false);
    }
  };

  const fetchForms = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingForms(true);
      } else {
        setLoadingForms(true);
      }
      const allForms = await getAllForms();
      setForms(allForms);

      const formStatsData = {
        total: allForms.length,
        active: allForms.filter((f) => f.status === FormStatus.ACTIVE).length,
        inactive: allForms.filter((f) => f.status === FormStatus.INACTIVE)
          .length,
        totalSubmissions: allForms.reduce(
          (sum, f) => sum + (f.submissions || 0),
          0,
        ),
      };

      setFormStats(formStatsData);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoadingForms(false);
      setIsRefreshingForms(false);
    }
  };

  const handleCreateForm = async (formData: FormBuilderData) => {
    try {
      setIsUpdatingForm(true);
      await createForm(formData, user?.uid || "");
      await fetchForms();
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    } finally {
      setIsUpdatingForm(false);
    }
  };

  const handleUpdateForm = async (formData: FormBuilderData) => {
    if (!selectedForm) return;

    try {
      setIsUpdatingForm(true);
      await updateForm(selectedForm.id, formData, selectedForm);
      await fetchForms();
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    } finally {
      setIsUpdatingForm(false);
    }
  };

  const handleFormStatusChange = async (
    formId: string,
    currentStatus: FormStatus,
  ) => {
    const newStatus =
      currentStatus === FormStatus.ACTIVE
        ? FormStatus.INACTIVE
        : FormStatus.ACTIVE;
    try {
      await updateFormStatus(formId, newStatus);
      await fetchForms();
    } catch (error) {
      console.error("Error updating form status:", error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteForm(formId);
      await fetchForms();
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const openFormBuilder = (form?: CustomForm) => {
    setSelectedForm(form || null);
    setIsFormBuilderOpen(true);
  };

  const handleViewUser = async (userData: UserWithId) => {
    setSelectedUser(userData);
    if (userData.validatedBy) {
      await fetchValidatedByName(userData.validatedBy);
    }
    setIsUserModalOpen(true);
  };

  const handleViewSubmissions = async (form: CustomForm) => {
    setSelectedFormForSubmissions(form);
    setIsSubmissionsModalOpen(true);
    setLoadingSubmissions(true);

    try {
      const submissions = await getFormSubmissions(form.id);
      setFormSubmissions(submissions);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      setFormSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleContactCardClick = (message: ContactMessage) => {
    setSelectedContact(message);
    setIsContactModalOpen(true);

    if (message.status === ContactStatus.UNREAD) {
      handleContactStatusUpdate(message.id, ContactStatus.READ);
    }
  };

  const handleRefreshUsers = () => {
    fetchUsers(true);
  };

  const handleRefreshContacts = () => {
    fetchContactMessages(true);
  };

  const handleRefreshForms = () => {
    fetchForms(true);
  };

  const fetchSettings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingSettings(true);
      } else {
        setLoadingSettings(true);
      }
      const appSettings = await getAppSettings();
      setSettings(appSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoadingSettings(false);
      setIsRefreshingSettings(false);
    }
  };

  const handleRefreshSettings = () => {
    fetchSettings(true);
  };

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don not have admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100  mt-15 p-5">
      <div className="max-w-screen mx-auto">
        <div className="bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl lg:p-8 p-2 py-4">
          <AdminHeader />

          <AdminTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            contactStats={contactStats}
          />

          <StatsCards
            activeTab={activeTab}
            userStats={stats}
            contactStats={contactStats}
            formStats={formStats}
          />

          {/* Tab Content */}
          {activeTab === "users" && (
            <UserManagementSection
              users={users}
              stats={stats}
              onViewUser={handleViewUser}
              onValidateUser={handleValidateUser}
              onRefresh={handleRefreshUsers}
              isRefreshing={isRefreshingUsers}
            />
          )}

          {activeTab === "contacts" && (
            <ContactManagementSection
              contactMessages={contactMessages}
              loadingContacts={loadingContacts}
              onContactClick={handleContactCardClick}
              onRefresh={handleRefreshContacts}
              isRefreshing={isRefreshingContacts}
            />
          )}

          {activeTab === "forms" && (
            <FormsManagementSection
              forms={forms}
              loadingForms={loadingForms}
              onCreateForm={() => openFormBuilder()}
              onEditForm={openFormBuilder}
              onToggleFormStatus={handleFormStatusChange}
              onDeleteForm={handleDeleteForm}
              onViewSubmissions={handleViewSubmissions}
              onRefresh={handleRefreshForms}
              isRefreshing={isRefreshingForms}
            />
          )}

          {activeTab === "settings" && (
            <SettingsManagementSection
              onRefresh={handleRefreshSettings}
              isRefreshing={isRefreshingSettings}
              adminId={user?.uid || ""}
            />
          )}

          {/* Contact Modal */}
          {selectedContact && (
            <ContactModal
              message={selectedContact}
              isOpen={isContactModalOpen}
              onClose={() => {
                setIsContactModalOpen(false);
                setSelectedContact(null);
              }}
              onUpdateStatus={handleContactStatusUpdate}
              isUpdating={isUpdatingContact}
            />
          )}

          {/* User Modal */}
          {selectedUser && (
            <UserModal
              user={selectedUser}
              isOpen={isUserModalOpen}
              onClose={() => {
                setIsUserModalOpen(false);
                setSelectedUser(null);
                setValidatedByName("");
              }}
              onValidateUser={handleValidateUser}
              isUpdating={isUpdatingUser}
              validatedByName={validatedByName}
            />
          )}

          {/* Form Builder Modal */}
          <FormBuilderModal
            isOpen={isFormBuilderOpen}
            onClose={() => {
              setIsFormBuilderOpen(false);
              setSelectedForm(null);
            }}
            onSave={selectedForm ? handleUpdateForm : handleCreateForm}
            initialData={
              selectedForm
                ? {
                    title: selectedForm.title,
                    description: selectedForm.description,
                    customFields: selectedForm.customFields.map((field) => ({
                      label: field.label,
                      type: field.type,
                      required: field.required,
                      order: field.order,
                    })),
                  }
                : undefined
            }
            isUpdating={isUpdatingForm}
          />

          {/* Form Submissions Modal */}
          {selectedFormForSubmissions && (
            <FormSubmissionsModal
              form={selectedFormForSubmissions}
              isOpen={isSubmissionsModalOpen}
              onClose={() => {
                setIsSubmissionsModalOpen(false);
                setSelectedFormForSubmissions(null);
                setFormSubmissions([]);
              }}
              submissions={formSubmissions}
              loading={loadingSubmissions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
