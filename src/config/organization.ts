// Organization Configuration
// This file contains all organization-specific settings that can be customized
// for different institutions or organizations using this template

export const organizationConfig = {
  // Basic Organization Info
  name: process.env.NEXT_PUBLIC_ORG_NAME || "Your Organization Name",
  shortName: process.env.NEXT_PUBLIC_ORG_SHORT_NAME || "ORG",
  description:
    process.env.NEXT_PUBLIC_ORG_DESCRIPTION ||
    "Official Organization Website",

  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_ORG_EMAIL || "contact@yourorg.com",
    phone: process.env.NEXT_PUBLIC_ORG_PHONE || "+1234567890",
    address: process.env.NEXT_PUBLIC_ORG_ADDRESS || "Your Organization Address",
  },

  // Website Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "Your Organization",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Official website of Your Organization",
  },

  // Branding & Theme
  branding: {
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#3b82f6",
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#1e40af",
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#f59e0b",
    logoPath: "/logos/main_logo.png",
    faviconPath: "/favicon.ico",
  },

  // Feature Toggles
  features: {
    enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "true",
    enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true",
    enableCustomForms: process.env.NEXT_PUBLIC_ENABLE_CUSTOM_FORMS === "true",
    enableTeamSection: process.env.NEXT_PUBLIC_ENABLE_TEAM_SECTION === "true",
    enableMaintenanceMode:
      process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === "true",
    enableStaticMode: process.env.NEXT_PUBLIC_ENABLE_STATIC_MODE === "true",
  },

  // Admin Configuration
  admin: {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@yourorg.com",
  },

  // Social Media Links
  socialMedia: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "",
  },

  // Analytics
  analytics: {
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
  },

  // Academic Configuration (Customizable for different institutions)
  academic: {
    // These will be moved to a separate configurable file
    institutionType: "engineering_college", // engineering_college, university, technical_institute

    // Default branches - can be customized in types/academic.ts
    defaultBranches: [
      "Computer Science",
      "Electronics & Telecommunications",
      "Electrical & Electronics",
      "Mechanical",
      "Civil",
      "Information Technology",
    ],

    // Default year classifications - can be customized
    defaultYears: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  },

  // Navigation Configuration
  navigation: {
    showDashboard: true,
    showForms: true,
    showContact: true,
    showAbout: true,
    showTeam: true,
  },
};

// Helper function to get organization config
export const getOrgConfig = () => organizationConfig;

// Type for organization configuration
export type OrganizationConfig = typeof organizationConfig;
