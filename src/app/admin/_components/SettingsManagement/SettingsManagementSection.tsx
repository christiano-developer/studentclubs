import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff, FaExclamationTriangle } from "react-icons/fa";
import { AppSettings, AppSettingsUpdate } from "@/types/auth";
import { getAppSettings, updateAppSettings } from "@/lib/firebase";

interface SettingsManagementSectionProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  adminId: string;
}

const SettingsManagementSection: React.FC<SettingsManagementSectionProps> = ({
  onRefresh,
  isRefreshing,
  adminId,
}) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const appSettings = await getAppSettings();
      setSettings(appSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setUpdateMessage({
        type: "error",
        text: "Failed to load settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingToggle = async (settingKey: keyof AppSettingsUpdate) => {
    if (!settings) return;

    try {
      setUpdating(true);
      const newValue = !settings[settingKey as keyof AppSettings];

      const updateData: AppSettingsUpdate = {
        [settingKey]: newValue,
      };

      await updateAppSettings(updateData, adminId);

      setSettings({
        ...settings,
        [settingKey]: newValue,
        updatedAt: new Date(),
        updatedBy: adminId,
      });

      setUpdateMessage({
        type: "success",
        text: `Setting updated successfully`,
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      setUpdateMessage({
        type: "error",
        text: "Failed to update setting. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchSettings();
    onRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to Load Settings
        </h3>
        <p className="text-gray-500 mb-4">
          Unable to load application settings.
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  const settingItems = [
    {
      key: "alloworgIdEdits" as const,
      title: "Allow Organization ID Edits",
      description: "Allow users to edit their Organization ID in the dashboard",
      icon: "🆔",
      value: settings.alloworgIdEdits,
    },
    {
      key: "allowUserRegistration" as const,
      title: "User Registration",
      description: "Allow new users to register for the platform",
      icon: "👤",
      value: settings.allowUserRegistration,
    },
    {
      key: "allowContactForm" as const,
      title: "Contact Form",
      description: "Allow users to submit contact form messages",
      icon: "📧",
      value: settings.allowContactForm,
    },
    {
      key: "allowPublicFormAccess" as const,
      title: "Public Form Access",
      description: "Allow public access to custom forms",
      icon: "📝",
      value: settings.allowPublicFormAccess,
    },
    {
      key: "maintenanceMode" as const,
      title: "Maintenance Mode",
      description: "Enable maintenance mode to restrict access",
      icon: "🚧",
      value: settings.maintenanceMode,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Application Settings
          </h2>
          <p className="text-sm text-gray-600">
            Configure site-wide settings and features
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Success/Error Messages */}
      {updateMessage && (
        <div
          className={`p-4 rounded-lg ${
            updateMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {updateMessage.text}
        </div>
      )}

      {/* Settings List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Feature Controls
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {settingItems.map((item) => (
            <div key={item.key} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${item.value ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.value ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    onClick={() => handleSettingToggle(item.key)}
                    disabled={updating}
                    className="focus:outline-none disabled:opacity-50"
                  >
                    {item.value ? (
                      <FaToggleOn className="h-6 w-6 text-green-500 hover:text-green-600" />
                    ) : (
                      <FaToggleOff className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Settings Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Last updated: {settings.updatedAt.toLocaleString()}</p>
              <p className="mt-1">
                Changes take effect immediately across the application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagementSection;
