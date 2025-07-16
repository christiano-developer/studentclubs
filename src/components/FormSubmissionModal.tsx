"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { submitForm } from "@/lib/firebase";
import {
  CustomForm,
  FormSubmissionData,
  FormSubmission,
  FieldType,
  Branch,
  YearOfStudy,
} from "@/types/auth";
import {
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaIdCard,
  FaPhone,
  FaPaperPlane,
  FaEnvelope,
} from "react-icons/fa";

interface FormSubmissionModalProps {
  form: CustomForm;
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  allowResubmission?: boolean;
  existingSubmission?: FormSubmission;
}

const FormSubmissionModal: React.FC<FormSubmissionModalProps> = ({
  form,
  isOpen,
  onClose,
  onFormSubmitted,
  allowResubmission = false,
  existingSubmission,
}) => {
  const { user } = useAuth();
  const [submissionData, setSubmissionData] = useState<FormSubmissionData>({
    name: "",
    email: "",
    branch: Branch.COMPUTER_SCIENCE,
    yearOfStudy: YearOfStudy.FIRST_YEAR,
    orgId: "",
    phoneNumber: "",
    agreedToTerms: false,
    customResponses: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.registrationData && isOpen) {
      // If we have an existing submission (for updates), pre-fill with that data
      if (existingSubmission) {
        setSubmissionData({
          name: user.registrationData.name,
          email: user.registrationData.email,
          branch: user.registrationData.branch,
          yearOfStudy: user.registrationData.yearOfStudy,
          orgId: user.registrationData.orgId,
          phoneNumber: existingSubmission.phoneNumber,
          agreedToTerms: false, // User must re-agree to terms
          customResponses: existingSubmission.customResponses || {},
        });
      } else {
        // For new submissions, start with empty data
        setSubmissionData({
          name: user.registrationData.name,
          email: user.registrationData.email,
          branch: user.registrationData.branch,
          yearOfStudy: user.registrationData.yearOfStudy,
          orgId: user.registrationData.orgId,
          phoneNumber: "",
          agreedToTerms: false,
          customResponses: {},
        });
      }
      setErrors({});
    }
  }, [user, isOpen, existingSubmission]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!submissionData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!submissionData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submissionData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!submissionData.orgId.trim()) {
      newErrors.orgId = "Organization ID is required";
    }

    if (!submissionData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(submissionData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!submissionData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms and conditions";
    }

    // Validate custom fields
    form.customFields.forEach((field) => {
      if (field.required) {
        const value = submissionData.customResponses[field.id];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[`custom_${field.id}`] = `${field.label} is required`;
        }
      }

      // Validate number fields
      if (field.type === FieldType.NUMBER) {
        const value = submissionData.customResponses[field.id];
        if (value && isNaN(Number(value))) {
          newErrors[`custom_${field.id}`] =
            `${field.label} must be a valid number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user?.uid) return;

    setIsSubmitting(true);

    try {
      await submitForm(form.id, user.uid, submissionData, allowResubmission);
      onFormSubmitted();
    } catch (error: unknown) {
      console.error("Error submitting form:", error);

      let errorMessage = "Failed to submit form";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomResponse = (fieldId: string, value: string | number) => {
    setSubmissionData((prev) => ({
      ...prev,
      customResponses: {
        ...prev.customResponses,
        [fieldId]: value,
      },
    }));
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{form.title}</h2>
            <p className="text-gray-600 mt-1">{form.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mandatory Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={submissionData.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={submissionData.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-1" />
                  Branch *
                </label>
                <select
                  value={submissionData.branch}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                >
                  {Object.values(Branch).map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-1" />
                  Year of Study *
                </label>
                <select
                  value={submissionData.yearOfStudy}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                >
                  {Object.values(YearOfStudy).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIdCard className="inline mr-1" />
                  Organization ID *
                </label>
                <input
                  type="text"
                  value={submissionData.orgId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  placeholder="Enter your Organization ID"
                />
                {errors.orgId && (
                  <p className="mt-1 text-sm text-red-600">{errors.orgId}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={submissionData.phoneNumber}
                  onChange={(e) =>
                    setSubmissionData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {form.customFields.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                {form.customFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && " *"}
                    </label>
                    <input
                      type={field.type}
                      value={submissionData.customResponses[field.id] || ""}
                      onChange={(e) => {
                        const value =
                          field.type === FieldType.NUMBER
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value;
                        updateCustomResponse(field.id, value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    {errors[`custom_${field.id}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`custom_${field.id}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={submissionData.agreedToTerms}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    agreedToTerms: e.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">
                I agree to the terms and conditions and confirm that all
                information provided is accurate. *
              </label>
            </div>
            {errors.agreedToTerms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.agreedToTerms}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>
                    {allowResubmission ? "Update Form" : "Submit Form"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default FormSubmissionModal;
