"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { getActiveForms, getUserFormSubmission } from "@/lib/firebase";
import { CustomForm, ValidationStatus, FormSubmission } from "@/types/auth";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaEye,
  FaEdit,
  FaSyncAlt,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";
import FormSubmissionModal from "@/components/FormSubmissionModal";
import ViewSubmissionModal from "@/components/ViewSubmissionModal";

const FormsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { settings, loading: settingsLoading } = useAppSettings();
  const router = useRouter();
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<
    Record<
      string,
      {
        hasSubmitted: boolean;
        submission?: FormSubmission;
        needsUpdate: boolean;
      }
    >
  >({});

  useEffect(() => {
    if (!loading && (!user || !user.isRegistered)) {
      router.push("/auth");
    } else if (
      !loading &&
      user?.registrationData?.validationStatus !== ValidationStatus.APPROVED
    ) {
      router.push("/dashboard");
    } else if (
      !loading &&
      !settingsLoading &&
      !settings?.allowPublicFormAccess &&
      user?.registrationData?.validationStatus === ValidationStatus.APPROVED
    ) {
      // Allow approved users to see forms even if public access is disabled
      // This only blocks unauthenticated/non-approved users
    }
  }, [user, loading, router, settings, settingsLoading]);

  useEffect(() => {
    if (
      user?.isRegistered &&
      user.registrationData?.validationStatus === ValidationStatus.APPROVED
    ) {
      fetchForms();
    }
  }, [user]);

  const fetchForms = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoadingForms(true);
      }
      const activeForms = await getActiveForms();
      setForms(activeForms);

      // Check user submissions for each form and detect updates
      if (user?.uid) {
        const submissionChecks = await Promise.all(
          activeForms.map(async (form) => {
            const submission = await getUserFormSubmission(form.id, user.uid);
            const hasSubmitted = submission !== null;

            // Check if form was updated after user's submission
            let needsUpdate = false;
            if (submission && form.updatedAt && submission.submittedAt) {
              needsUpdate = form.updatedAt > submission.submittedAt;
            }

            return {
              formId: form.id,
              hasSubmitted,
              submission,
              needsUpdate,
            };
          }),
        );

        const submissionMap = submissionChecks.reduce(
          (acc, { formId, hasSubmitted, submission, needsUpdate }) => {
            acc[formId] = {
              hasSubmitted,
              submission: submission || undefined,
              needsUpdate,
            };
            return acc;
          },
          {} as Record<
            string,
            {
              hasSubmitted: boolean;
              submission?: FormSubmission;
              needsUpdate: boolean;
            }
          >,
        );
        setUserSubmissions(submissionMap);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoadingForms(false);
      setIsRefreshing(false);
    }
  };

  const handleFillForm = (form: CustomForm) => {
    setSelectedForm(form);
    setIsSubmissionModalOpen(true);
  };

  const handleViewSubmission = (form: CustomForm) => {
    const submissionData = userSubmissions[form.id];
    if (submissionData?.submission) {
      setSelectedForm(form);
      setSelectedSubmission(submissionData.submission);
      setIsViewModalOpen(true);
    }
  };

  const handleFormSubmitted = () => {
    // Refresh forms data to get updated submission info
    fetchForms();
    setIsSubmissionModalOpen(false);
    setSelectedForm(null);
  };

  const handleRefresh = () => {
    fetchForms(true);
  };

  if (loading || loadingForms || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading
              ? "Loading user data..."
              : settingsLoading
                ? "Loading settings..."
                : "Loading forms..."}
          </p>
        </div>
      </div>
    );
  }

  if (
    !user?.isRegistered ||
    user.registrationData?.validationStatus !== ValidationStatus.APPROVED
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need to be an approved member to access forms.
          </p>
        </div>
      </div>
    );
  }

  // Show public forms disabled message for non-approved users when setting is off
  if (
    !settings?.allowPublicFormAccess &&
    user.registrationData?.validationStatus !== ValidationStatus.APPROVED
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
              <FaLock className="mx-auto text-red-500 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-3">
                Public Forms Access Disabled
              </h2>
              <p className="text-red-700">
                Public access to forms is currently disabled. This feature is
                temporarily unavailable.
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <FaInfoCircle className="text-blue-500" />
                <span>This restriction applies to public access only.</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Note:</p>
                <p>Approved members can still access forms when logged in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-16 lg:mt-15 p-2 lg:p-5">
      <div className="max-w-full lg:max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl p-4 lg:p-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Available Forms
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Fill out the forms available for org members
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loadingForms}
                className="w-full lg:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSyncAlt
                  className={`${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* Forms List */}
          {forms.length === 0 ? (
            <div className="text-center py-8 lg:py-12">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">
                No Forms Available
              </h3>
              <p className="text-sm lg:text-base text-gray-500">
                There are currently no active forms to fill out.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {forms.map((form) => {
                  const submissionData = userSubmissions[form.id] || {
                    hasSubmitted: false,
                    needsUpdate: false,
                  };
                  const { hasSubmitted, needsUpdate } = submissionData;

                  return (
                    <div
                      key={form.id}
                      className={`p-3 lg:p-4 hover:bg-gray-50 transition-colors ${
                        hasSubmitted
                          ? needsUpdate
                            ? "bg-orange-50"
                            : "bg-green-50"
                          : ""
                      }`}
                    >
                      <div className="flex flex-row items-start justify-between lg:items-center space-x-3 lg:space-x-0">
                        {/* Form Info */}
                        <div className="flex-1 min-w-0 lg:mr-4">
                          <div className="mb-3">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-2 lg:space-y-0">
                              <h3 className="text-base lg:text-lg font-semibold text-gray-900 break-words">
                                {form.title}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {hasSubmitted && !needsUpdate && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                                    <FaCheckCircle />
                                    <span>Submitted</span>
                                  </span>
                                )}
                                {hasSubmitted && needsUpdate && (
                                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                                    <FaEdit />
                                    <span>Update Available</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600 text-sm lg:text-sm line-clamp-2">
                              {form.description}
                            </p>
                            <div className="flex flex-wrap gap-3 lg:gap-4 text-xs lg:text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <FaUsers className="flex-shrink-0" />
                                <span>{form.submissions || 0} submissions</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaClock className="flex-shrink-0" />
                                <span>
                                  {form.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:space-x-2 lg:space-y-0 shrink-0">
                          {hasSubmitted && (
                            <button
                              onClick={() => handleViewSubmission(form)}
                              className="px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                            >
                              <FaEye />
                              <span>View</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleFillForm(form)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm ${
                              !hasSubmitted
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : needsUpdate
                                  ? "bg-orange-600 text-white hover:bg-orange-700"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={hasSubmitted && !needsUpdate}
                          >
                            {!hasSubmitted ? (
                              <>
                                <span>Fill Form</span>
                                <FaArrowRight />
                              </>
                            ) : needsUpdate ? (
                              <>
                                <FaEdit />
                                <span>Update</span>
                              </>
                            ) : (
                              <>
                                <FaCheckCircle />
                                <span>Submitted</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Submission Modal */}
          {selectedForm && (
            <FormSubmissionModal
              form={selectedForm}
              isOpen={isSubmissionModalOpen}
              onClose={() => {
                setIsSubmissionModalOpen(false);
                setSelectedForm(null);
              }}
              onFormSubmitted={handleFormSubmitted}
              allowResubmission={
                userSubmissions[selectedForm.id]?.needsUpdate || false
              }
              existingSubmission={userSubmissions[selectedForm.id]?.submission}
            />
          )}

          {/* View Submission Modal */}
          {selectedForm && selectedSubmission && (
            <ViewSubmissionModal
              form={selectedForm}
              submission={selectedSubmission}
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false);
                setSelectedForm(null);
                setSelectedSubmission(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
