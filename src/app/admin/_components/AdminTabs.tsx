import React from "react";
import { FaUsers, FaEnvelope, FaFileAlt, FaCog } from "react-icons/fa";

export type AdminTab = "users" | "contacts" | "forms" | "settings";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  contactStats: {
    unread: number;
  };
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  onTabChange,
  contactStats,
}) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
      <button
        onClick={() => onTabChange("users")}
        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "users"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <FaUsers />
          <span className="hidden lg:block">User Management</span>
        </div>
      </button>
      <button
        onClick={() => onTabChange("contacts")}
        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "contacts"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <FaEnvelope />
          <span className="hidden lg:block">Messages Management</span>

          {contactStats.unread > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {contactStats.unread}
            </span>
          )}
        </div>
      </button>
      <button
        onClick={() => onTabChange("forms")}
        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "forms"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <FaFileAlt />

          <span className="hidden lg:block">Forms Management</span>
        </div>
      </button>
      <button
        onClick={() => onTabChange("settings")}
        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "settings"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <FaCog />
          <span className="hidden lg:block">Settings</span>
        </div>
      </button>
    </div>
  );
};

export default AdminTabs;
