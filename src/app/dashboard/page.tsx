"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ValidationStatus,
  Branch,
  YearOfStudy,
  UserRegistration,
} from "@/types/auth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { checkorgIdExists } from "@/lib/firebase";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaCalendarAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";

const DashboardPage: React.FC = () => {
  const { user, loading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();
  const {
    settings,
    loading: settingsLoading,
    error: settingsError,
    refreshSettings,
  } = useAppSettings();

  // Edit profile states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    branch: Branch.COMPUTER_SCIENCE,
    yearOfStudy: YearOfStudy.FIRST_YEAR,
    orgId: "",
  });
  const [orgIdErrors, setorgIdErrors] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    } else if (user && !user.isRegistered) {
      router.push("/register");
    }
  }, [user, loading, router]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user?.registrationData) {
      setFormData({
        branch: user.registrationData.branch,
        yearOfStudy: user.registrationData.yearOfStudy,
        orgId: user.registrationData.orgId,
      });
    }
  }, [user]);

  // Clear update message after 5 seconds
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleEditProfile = () => {
    // Don't allow edit mode if settings are still loading
    if (settingsLoading) {
      setUpdateMessage({
        type: "error",
        text: "Please wait while settings are loading...",
      });
      return;
    }

    setIsEditMode(true);
    setUpdateMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to current user data
    if (user?.registrationData) {
      setFormData({
        branch: user.registrationData.branch,
        yearOfStudy: user.registrationData.yearOfStudy,
        orgId: user.registrationData.orgId,
      });
    }
    setorgIdErrors("");
    setUpdateMessage(null);
  };

  const handleSaveProfile = async () => {
    if (!user?.registrationData) return;

    setIsUpdating(true);
    setUpdateMessage(null);
    setorgIdErrors("");

    try {
      // Validate Organization ID if it's being edited and settings allow it
      if (
        settings?.alloworgIdEdits &&
        formData.orgId !== user.registrationData.orgId
      ) {
        if (!/^\d{9}$/.test(formData.orgId)) {
          setorgIdErrors("Organization ID must be exactly 9 digits");
          setIsUpdating(false);
          return;
        }

        const orgIdExists = await checkorgIdExists(formData.orgId, user.uid);
        if (orgIdExists) {
          setorgIdErrors(
            "This Organization ID is already registered by another user",
          );
          setIsUpdating(false);
          return;
        }
      }

      const updateData: Partial<UserRegistration> = {
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
        ...(settings?.alloworgIdEdits &&
        formData.orgId !== user.registrationData.orgId
          ? { orgId: formData.orgId }
          : {}),
      };

      await updateUserProfile(updateData);

      setIsEditMode(false);
      setUpdateMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormChange = (
    field: "branch" | "yearOfStudy" | "orgId",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear Organization ID errors when user starts typing
    if (field === "orgId") {
      setorgIdErrors("");
    }
  };

  const getStatusColor = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return "text-green-600 ";
      case ValidationStatus.PENDING:
        return "text-yellow-600 bg-yellow-100";
      case ValidationStatus.REJECTED:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  const getStatusColorRing = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return "border-green-500";
      case ValidationStatus.PENDING:
        return "border-yellow-500";
      case ValidationStatus.REJECTED:
        return "border-red-500";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return <FaCheckCircle className="text-green-500" />;
      case ValidationStatus.PENDING:
        return <FaClock className="text-yellow-500" />;
      case ValidationStatus.REJECTED:
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading user data..." : "Loading settings..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user?.isRegistered || !user.registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Required
          </h1>
          <p className="text-gray-600">
            Please complete your registration to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 mt-15 lg:mt-0 flex items-center">
      <div className="max-w-full lg:max-w-10xl mx-auto w-full">
        <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 lg:p-10">
          {/* Success/Error Messages */}
          {updateMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                updateMessage.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {updateMessage.text}
            </div>
          )}

          {/* Settings Error Message */}
          {settingsError && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaInfoCircle className="text-yellow-600" />
                  <span>
                    Settings could not be loaded. Some features may be
                    unavailable.
                  </span>
                </div>
                <button
                  onClick={refreshSettings}
                  className="text-yellow-600 hover:text-yellow-800 underline text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
              {user.photoURL && (
                <Image
                  width={64}
                  height={64}
                  src={user.photoURL}
                  alt="Profile"
                  className={`w-16 h-16 sm:w-16 sm:h-16 rounded-full border-4 ${getStatusColorRing(user.registrationData.validationStatus)}`}
                />
              )}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome, {user.displayName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-x-5">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Organization Student Member
                  </p>
                  {user.registrationData.validationStatus ===
                  ValidationStatus.APPROVED ? (
                    <div className="bg-green-600/50 border border-green-600 rounded-lg px-3 py-1">
                      <p className="text-xs sm:text-sm text-green-800">
                        Active
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-600/50 border border-red-600 rounded-lg px-3 py-1">
                      <p className="text-xs sm:text-sm text-red-800">
                        Inactive
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full lg:w-auto">
              <div className="space-y-3 w-full lg:w-auto">
                {!isEditMode ? (
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{isUpdating ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full lg:w-auto flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            <div className="lg:col-span-2">
              <div className="rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-inner shadow-black/20 bg-gray-50/50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Full Name
                      </p>
                      <p className="font-medium text-sm sm:text-base break-words">
                        {user.registrationData.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Email</p>
                      <p className="font-medium text-sm sm:text-base break-all">
                        {user.registrationData.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaIdCard className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs sm:text-sm">Organization ID</p>
                      </div>
                      {isEditMode && settings?.alloworgIdEdits ? (
                        <div className="w-full">
                          <input
                            type="text"
                            value={formData.orgId}
                            onChange={(e) =>
                              handleFormChange("orgId", e.target.value)
                            }
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter 9-digit Organization ID"
                            maxLength={9}
                          />
                          {orgIdErrors && (
                            <p className="mt-1 text-sm text-red-600">
                              {orgIdErrors}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <p
                            className={`${getStatusColor(user.registrationData.validationStatus)} font-bold text-sm sm:text-base break-words`}
                          >
                            {user.registrationData.orgId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaIdCard className="text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Roll Number
                      </p>
                      <p className="font-medium text-sm sm:text-base break-words">
                        {user.registrationData.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Branch</p>
                      {isEditMode ? (
                        <select
                          value={formData.branch}
                          onChange={(e) =>
                            handleFormChange("branch", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.values(Branch).map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-medium text-sm sm:text-base break-words">
                          {user.registrationData.branch}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Year of Study
                      </p>
                      {isEditMode ? (
                        <select
                          value={formData.yearOfStudy}
                          onChange={(e) =>
                            handleFormChange("yearOfStudy", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.values(YearOfStudy).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-medium text-sm sm:text-base break-words">
                          {user.registrationData.yearOfStudy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {user.registrationData.validationStatus !=
              ValidationStatus.APPROVED ? (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Account Status
                  </h2>
                  <div className="space-y-4">
                    <div
                      className={`flex items-center space-x-3 p-3 rounded-lg ${getStatusColor(user.registrationData.validationStatus)}`}
                    >
                      {getStatusIcon(user.registrationData.validationStatus)}
                      <div>
                        <p className="font-medium">Validation Status</p>
                      </div>
                    </div>

                    {user.registrationData.validationStatus ===
                      ValidationStatus.PENDING && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          Your Organization ID is currently being validated by
                          our admin team. This process typically takes 1-2
                          business days.
                        </p>
                      </div>
                    )}

                    {user.registrationData.validationStatus ===
                      ValidationStatus.REJECTED && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                          Your Organization ID could not be validated. Please
                          contact our admin team for assistance or update your
                          information.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg p-4 sm:p-6 min-w-fit shadow-inner shadow-black/20 bg-gray-50/50">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Registration Details
                  </h2>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span>Registered:</span>
                      <p className="underline font-bold break-words">
                        {user.registrationData.createdAt.toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span>Last Updated:</span>
                      <p className="underline font-bold tracking-tighter break-words">
                        {user.registrationData.updatedAt.toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}{" "}
                        At{" "}
                        {user.registrationData.updatedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    {user.registrationData.validatedAt && (
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span>Validated On:</span>
                        <p className="underline font-bold break-words">
                          {user.registrationData.validatedAt.toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
