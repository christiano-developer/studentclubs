import { useState, useEffect } from "react";
import { AppSettings } from "@/types/auth";
import { getAppSettings } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export const useAppSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch settings if auth is not loading
    if (!authLoading) {
      fetchSettings();
    }
  }, [authLoading, user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // If user is not authenticated, return default settings without making Firestore call
      if (!user) {
        setSettings({
          id: "default",
          alloworgIdEdits: false,
          allowUserRegistration: true,
          allowContactForm: true,
          allowPublicFormAccess: true,
          maintenanceMode: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: "system",
        });
        setLoading(false);
        return;
      }

      // Fetch settings from Firestore for authenticated users
      const appSettings = await getAppSettings();
      setSettings(appSettings);
    } catch (err) {
      console.error("Error fetching app settings:", err);
      setError("Failed to load settings");
      // Set default settings on error
      setSettings({
        id: "default",
        alloworgIdEdits: false,
        allowUserRegistration: true,
        allowContactForm: true,
        allowPublicFormAccess: true,
        maintenanceMode: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: "system",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    refreshSettings,
  };
};
