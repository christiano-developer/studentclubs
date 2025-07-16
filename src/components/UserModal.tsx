"use client";

import React from "react";
import { createPortal } from "react-dom";
import { UserRegistration, ValidationStatus } from "@/types/auth";
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import Image from "next/image";

interface UserWithId extends UserRegistration {
  id: string;
}

interface UserModalProps {
  user: UserWithId;
  isOpen: boolean;
  onClose: () => void;
  onValidateUser: (userId: string, status: ValidationStatus) => Promise<void>;
  isUpdating: boolean;
  validatedByName?: string;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onValidateUser,
  isUpdating,
  validatedByName,
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case ValidationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ValidationStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return <FaCheckCircle className="text-green-600" />;
      case ValidationStatus.PENDING:
        return <FaClock className="text-yellow-600" />;
      case ValidationStatus.REJECTED:
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const handleStatusUpdate = async (status: ValidationStatus) => {
    try {
      await onValidateUser(user.id, status);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 border ${getStatusColor(user.validationStatus)}`}
            >
              {getStatusIcon(user.validationStatus)}
              <span className="capitalize">{user.validationStatus}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isUpdating}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <FaUser className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">org ID</p>
                  <p className="font-medium text-gray-900">{user.orgId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-medium text-gray-900">{user.rollNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBuilding className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium text-gray-900">{user.branch}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Year of Study</p>
                  <p className="font-medium text-gray-900">
                    {user.yearOfStudy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Image */}
          {user.gecIdCardUrl && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Org ID Card
              </h3>
              <div className="flex justify-center">
                <Image
                  width={400}
                  height={300}
                  src={user.gecIdCardUrl}
                  alt="Org ID Card"
                  className="rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Registration Timeline */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Registration Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium">
                  {user.createdAt.toLocaleDateString()} at{" "}
                  {user.createdAt.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {user.updatedAt.toLocaleDateString()} at{" "}
                  {user.updatedAt.toLocaleTimeString()}
                </span>
              </div>
              {user.validatedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Validated:</span>
                  <span className="font-medium">
                    {user.validatedAt.toLocaleDateString()} at{" "}
                    {user.validatedAt.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {user.validatedBy && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Validated By:</span>
                  <span className="font-medium">
                    {validatedByName || user.validatedBy}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            {user.validationStatus === ValidationStatus.PENDING && (
              <>
                <button
                  onClick={() => handleStatusUpdate(ValidationStatus.APPROVED)}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaCheckCircle />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(ValidationStatus.REJECTED)}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <FaTimesCircle />
                  <span>Reject</span>
                </button>
              </>
            )}

            {user.validationStatus === ValidationStatus.REJECTED && (
              <button
                onClick={() => handleStatusUpdate(ValidationStatus.APPROVED)}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaCheckCircle />
                <span>Approve</span>
              </button>
            )}

            {user.validationStatus === ValidationStatus.APPROVED && (
              <button
                onClick={() => handleStatusUpdate(ValidationStatus.REJECTED)}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FaTimesCircle />
                <span>Reject</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isUpdating}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
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

export default UserModal;
