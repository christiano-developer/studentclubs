import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const EmptyContactState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <FaEnvelope className="text-gray-400 text-6xl mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No Contact Messages
      </h3>
      <p className="text-gray-500">
        No messages have been received yet.
      </p>
    </div>
  );
};

export default EmptyContactState;