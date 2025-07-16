import React from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaIdCard,
  FaPhone,
  FaCheck,
  FaEnvelope,
} from "react-icons/fa";
import { CustomForm, FormSubmission } from "@/types/auth";

interface ViewSubmissionModalProps {
  form: CustomForm;
  submission: FormSubmission;
  isOpen: boolean;
  onClose: () => void;
}

const ViewSubmissionModal: React.FC<ViewSubmissionModalProps> = ({
  form,
  submission,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Submission
            </h2>
            <p className="text-gray-600 mt-1">{form.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaCheck className="text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Submitted Successfully
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              Submitted on: {submission.submittedAt.toLocaleDateString()} at{" "}
              {submission.submittedAt.toLocaleTimeString()}
            </p>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Full Name</span>
                  <p className="font-medium text-gray-900">{submission.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Email</span>
                  <p className="font-medium text-gray-900">
                    {submission.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaBuilding className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Branch</span>
                  <p className="font-medium text-gray-900">
                    {submission.branch}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Year of Study</span>
                  <p className="font-medium text-gray-900">
                    {submission.yearOfStudy}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaIdCard className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">org ID</span>
                  <p className="font-medium text-gray-900">
                    {submission.orgId}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <FaPhone className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Phone Number</span>
                  <p className="font-medium text-gray-900">
                    {submission.phoneNumber}
                  </p>
                </div>
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
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 block mb-1">
                      {field.label}
                    </span>
                    <p className="font-medium text-gray-900">
                      {submission.customResponses[field.id] || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaCheck className="text-green-600" />
              <span className="text-sm text-gray-700">
                Terms and conditions accepted
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default ViewSubmissionModal;
