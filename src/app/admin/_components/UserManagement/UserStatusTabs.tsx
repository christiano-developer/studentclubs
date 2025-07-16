import React from "react";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export type UserStatusTab = "pending" | "approved" | "rejected";

interface UserStatusTabsProps {
  activeTab: UserStatusTab;
  onTabChange: (tab: UserStatusTab) => void;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

const UserStatusTabs: React.FC<UserStatusTabsProps> = ({
  activeTab,
  onTabChange,
  stats,
}) => {
  return (
    <div className="flex lg:space-x-1 bg-white p-1 rounded-lg mb-6 shadow-sm">
      <button
        onClick={() => onTabChange("pending")}
        className={`flex-1 py-2 lg:px-4 px-1 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
          activeTab === "pending"
            ? "bg-yellow-500 text-white shadow-sm"
            : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
        }`}
      >
        <FaClock />
        <span className="hidden lg:flex">Pending</span>
        {stats.pending > 0 && (
          <span
            className={`lg:px-2 py-1 rounded-full text-xs ${
              activeTab === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {stats.pending}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange("approved")}
        className={`flex-1 py-2 lg:px-4 px-1  text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
          activeTab === "approved"
            ? "bg-green-500 text-white shadow-sm rounded-md "
            : "text-green-600 hover:text-green-700 hover:bg-green-50 border-x border-gray-300 mx-2"
        }`}
      >
        <FaCheckCircle />
        <span className="hidden lg:flex">Approved</span>
        {stats.approved > 0 && (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              activeTab === "approved"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-600"
            }`}
          >
            {stats.approved}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange("rejected")}
        className={`flex-1 py-2 lg:px-4 px-1 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
          activeTab === "rejected"
            ? "bg-red-500 text-white shadow-sm"
            : "text-red-600 hover:text-red-700 hover:bg-red-50"
        }`}
      >
        <FaTimesCircle />
        <span className="hidden lg:flex">Rejected</span>
        {stats.rejected > 0 && (
          <span
            className={`lg:px-2 py-1 rounded-full text-xs ${
              activeTab === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-600"
            }`}
          >
            {stats.rejected}
          </span>
        )}
      </button>
    </div>
  );
};

export default UserStatusTabs;
