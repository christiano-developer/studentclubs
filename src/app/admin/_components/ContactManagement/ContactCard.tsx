import React from 'react';
import { FaEnvelope, FaCheck, FaCheckDouble, FaClock } from 'react-icons/fa';
import { ContactMessage, ContactStatus } from '@/types/auth';

interface ContactCardProps {
  message: ContactMessage;
  onClick: (message: ContactMessage) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ message, onClick }) => {
  const getContactStatusColor = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.UNREAD:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ContactStatus.READ:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ContactStatus.RESOLVED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getContactStatusIcon = (status: ContactStatus) => {
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

  return (
    <div
      onClick={() => onClick(message)}
      className={`bg-white rounded-lg border-2 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${getContactStatusColor(
        message.status,
      )}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getContactStatusIcon(message.status)}
          <span className="text-sm font-medium capitalize">
            {message.status}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {message.createdAt.toLocaleDateString()}
        </span>
      </div>

      {/* Sender Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 truncate">
          {message.name}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {message.email}
        </p>
      </div>

      {/* Message Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {message.message}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {message.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {message.status === ContactStatus.UNREAD && (
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default ContactCard;