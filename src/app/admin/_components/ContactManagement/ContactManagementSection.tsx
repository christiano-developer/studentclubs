import React from 'react';
import { ContactMessage } from '@/types/auth';
import ContactCard from './ContactCard';
import EmptyContactState from './EmptyContactState';
import { FaSyncAlt } from 'react-icons/fa';

interface ContactManagementSectionProps {
  contactMessages: ContactMessage[];
  loadingContacts: boolean;
  onContactClick: (message: ContactMessage) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ContactManagementSection: React.FC<ContactManagementSectionProps> = ({
  contactMessages,
  loadingContacts,
  onContactClick,
  onRefresh,
  isRefreshing = false,
}) => {
  if (loadingContacts) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">
          Loading contact messages...
        </p>
      </div>
    );
  }

  if (contactMessages.length === 0) {
    return <EmptyContactState />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Contact Messages
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''} text-xs`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactMessages.map((message) => (
          <ContactCard
            key={message.id}
            message={message}
            onClick={onContactClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactManagementSection;