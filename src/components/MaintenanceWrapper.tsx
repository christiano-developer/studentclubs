"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import MaintenanceMode from "./MaintenanceMode";
import { useState } from "react";

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { settings, loading: settingsLoading } = useAppSettings();
  const [adminOverride, setAdminOverride] = useState(false);

  // Show loading while checking maintenance status
  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading user data..." : "Loading settings..."}
          </p>
        </div>
      </div>
    );
  }

  // Show maintenance mode if enabled (unless admin has overridden)
  if (settings?.maintenanceMode && !adminOverride) {
    const isAdmin = user?.isAdmin;
    
    return (
      <MaintenanceMode 
        isAdmin={isAdmin}
        onAdminAccess={isAdmin ? () => setAdminOverride(true) : undefined}
      />
    );
  }

  // Normal app rendering
  return <>{children}</>;
};

export default MaintenanceWrapper;