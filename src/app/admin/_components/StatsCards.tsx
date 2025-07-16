import React from "react";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaCheck,
  FaCheckDouble,
  FaFileAlt,
} from "react-icons/fa";
import { AdminTab } from "./AdminTabs";

interface StatsCardsProps {
  activeTab: AdminTab;
  userStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  contactStats: {
    total: number;
    unread: number;
    read: number;
    resolved: number;
  };
  formStats: {
    total: number;
    active: number;
    inactive: number;
    totalSubmissions: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({
  activeTab,
  userStats,
  contactStats,
  formStats,
}) => {
  if (activeTab === "users") {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total </p>
              <p className="text-3xl font-bold">{userStats.total}</p>
            </div>
            <FaUsers className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Pending</p>
              <p className="text-3xl font-bold">{userStats.pending}</p>
            </div>
            <FaClock className="text-4xl text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Approved</p>
              <p className="text-3xl font-bold">{userStats.approved}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Rejected</p>
              <p className="text-3xl font-bold">{userStats.rejected}</p>
            </div>
            <FaTimesCircle className="text-4xl text-red-200" />
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "forms") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Forms</p>
              <p className="text-3xl font-bold">{formStats.total}</p>
            </div>
            <FaFileAlt className="text-4xl text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Forms</p>
              <p className="text-3xl font-bold">{formStats.active}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100">Inactive Forms</p>
              <p className="text-3xl font-bold">{formStats.inactive}</p>
            </div>
            <FaTimesCircle className="text-4xl text-gray-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Submissions</p>
              <p className="text-3xl font-bold">{formStats.totalSubmissions}</p>
            </div>
            <FaUsers className="text-4xl text-blue-200" />
          </div>
        </div>
      </div>
    );
  }
  if (activeTab === "contacts") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Messages</p>
              <p className="text-3xl font-bold">{contactStats.total}</p>
            </div>
            <FaEnvelope className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Unread</p>
              <p className="text-3xl font-bold">{contactStats.unread}</p>
            </div>
            <FaEnvelope className="text-4xl text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Read</p>
              <p className="text-3xl font-bold">{contactStats.read}</p>
            </div>
            <FaCheck className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Resolved</p>
              <p className="text-3xl font-bold">{contactStats.resolved}</p>
            </div>
            <FaCheckDouble className="text-4xl text-green-200" />
          </div>
        </div>
      </div>
    );
  }

  // Default to contacts stats
  return <></>;
};

export default StatsCards;
