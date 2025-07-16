import React from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { UserStatusTab } from './UserStatusTabs';

interface EmptyUserStateProps {
  statusTab: UserStatusTab;
}

const EmptyUserState: React.FC<EmptyUserStateProps> = ({ statusTab }) => {
  return (
    <div className="text-center py-12">
      {statusTab === "pending" && (
        <>
          <FaClock className="text-yellow-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Pending Users
          </h3>
          <p className="text-gray-500">
            All users have been reviewed. Great job!
          </p>
        </>
      )}
      {statusTab === "approved" && (
        <>
          <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Approved Users
          </h3>
          <p className="text-gray-500">
            No users have been approved yet.
          </p>
        </>
      )}
      {statusTab === "rejected" && (
        <>
          <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Rejected Users
          </h3>
          <p className="text-gray-500">
            No users have been rejected yet.
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyUserState;