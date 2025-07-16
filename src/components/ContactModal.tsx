"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ContactMessage, ContactStatus } from "@/types/auth";
import {
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaEnvelope,
  FaUser,
  FaClock,
} from "react-icons/fa";

interface ContactModalProps {
  message: ContactMessage;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (messageId: string, status: ContactStatus) => Promise<void>;
  isUpdating: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({
  message,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating,
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.UNREAD:
        return "bg-yellow-100 text-yellow-800";
      case ContactStatus.READ:
        return "bg-blue-100 text-blue-800";
      case ContactStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.UNREAD:
        return <FaEnvelope className="text-yellow-600" />;
      case ContactStatus.READ:
        return <FaCheck className="text-blue-600" />;
      case ContactStatus.RESOLVED:
        return <FaCheckDouble className="text-green-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const handleStatusUpdate = async (status: ContactStatus) => {
    try {
      await onUpdateStatus(message.id, status);
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Message
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(message.status)}`}
            >
              {getStatusIcon(message.status)}
              <span className="capitalize">{message.status}</span>
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
          {/* Sender Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{message.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{message.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Received:</span>
                <span className="font-medium">
                  {message.createdAt.toLocaleDateString()} at{" "}
                  {message.createdAt.toLocaleTimeString()}
                </span>
              </div>
              {message.readAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Read:</span>
                  <span className="font-medium">
                    {message.readAt.toLocaleDateString()} at{" "}
                    {message.readAt.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {message.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved:</span>
                  <span className="font-medium">
                    {message.resolvedAt.toLocaleDateString()} at{" "}
                    {message.resolvedAt.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            {message.status === ContactStatus.UNREAD && (
              <button
                onClick={() => handleStatusUpdate(ContactStatus.READ)}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <FaCheck />
                <span>Mark as Read</span>
              </button>
            )}

            {message.status !== ContactStatus.RESOLVED && (
              <button
                onClick={() => handleStatusUpdate(ContactStatus.RESOLVED)}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaCheckDouble />
                <span>Mark as Resolved</span>
              </button>
            )}

            {message.status === ContactStatus.READ && (
              <button
                onClick={() => handleStatusUpdate(ContactStatus.UNREAD)}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                <FaEnvelope />
                <span>Mark as Unread</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isUpdating}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default ContactModal;
