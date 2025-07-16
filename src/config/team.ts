// Team Configuration
// Customize this file to match your organization's team structure

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  image: string;
  email?: string;
  linkedin?: string;
  github?: string;
  order?: number;
}

export interface TeamSection {
  id: string;
  title: string;
  description?: string;
  color: string;
  shadowColor: string;
  members: TeamMember[];
}

// Default team configuration - customize this for your organization
export const defaultTeamConfig: TeamSection[] = [
  {
    id: "leadership",
    title: "Executive Team",
    description: "Our core leadership team",
    color: "text-blue-500",
    shadowColor: "drop-shadow-blue-700",
    members: [
      {
        id: "advisor",
        name: "Dr. Jane Smith",
        role: "Faculty Advisor",
        description: "Guiding our organization with wisdom and experience",
        image: "/team/advisors/advisor.jpg",
        order: 1,
      },
      {
        id: "president",
        name: "Alex Johnson",
        role: "President",
        description: "Leading our organization towards excellence",
        image: "/team/leadership/chairperson.jpg",
        order: 2,
      },
      {
        id: "vice_president",
        name: "Sarah Williams",
        role: "Vice President",
        description: "Supporting leadership and driving initiatives",
        image: "/team/leadership/vice_chairperson.jpg",
        order: 3,
      },
      {
        id: "secretary",
        name: "Michael Brown",
        role: "Secretary",
        description: "Managing communications and documentation",
        image: "/team/leadership/secretary.jpg",
        order: 4,
      },
      {
        id: "treasurer",
        name: "Emily Davis",
        role: "Treasurer",
        description: "Managing finances and budgets",
        image: "/team/leadership/treasurer.jpg",
        order: 5,
      },
      {
        id: "webmaster",
        name: "David Wilson",
        role: "Technical Lead",
        description: "Building and maintaining our digital presence",
        image: "/team/otherwings/webmaster.jpg",
        order: 6,
      },
    ],
  },
  {
    id: "coordinators",
    title: "Coordinators Team",
    description: "Specialized team coordinators",
    color: "text-green-500",
    shadowColor: "drop-shadow-green-700",
    members: [
      // Add coordinator members here
      // This section can be customized based on your organization structure
    ],
  },
  {
    id: "special_committee",
    title: "Special Committee",
    description: "Our specialized committee team",
    color: "text-pink-700",
    shadowColor: "drop-shadow-destructive",
    members: [
      {
        id: "special_chair",
        name: "Lisa Martinez",
        role: "Committee Chair",
        description: "Leading our special committee initiatives",
        image: "/team/otherwings/Chairperson_WIE.jpg",
        order: 1,
      },
      {
        id: "special_vice_chair",
        name: "James Rodriguez",
        role: "Vice Chair",
        description: "Supporting committee operations",
        image: "/team/otherwings/Vice_Chair_WIE.jpg",
        order: 2,
      },
      {
        id: "special_treasurer",
        name: "Maria Garcia",
        role: "Committee Treasurer",
        description: "Managing committee finances",
        image: "/team/otherwings/Treasurer_WIE.jpg",
        order: 3,
      },
      {
        id: "special_secretary",
        name: "Robert Anderson",
        role: "Committee Secretary",
        description: "Handling committee communications",
        image: "/team/otherwings/Secretary_WIE.jpg",
        order: 4,
      },
    ],
  },
];

// Helper function to get team configuration
export const getTeamConfig = (): TeamSection[] => {
  // You can add logic here to load team config from environment variables,
  // database, or external config files
  return defaultTeamConfig;
};

// Helper function to get all team members (flattened)
export const getAllTeamMembers = (): TeamMember[] => {
  return defaultTeamConfig.flatMap((section) => section.members);
};

// Helper function to get team members by section
export const getTeamMembersBySection = (sectionId: string): TeamMember[] => {
  const section = defaultTeamConfig.find((s) => s.id === sectionId);
  return section ? section.members : [];
};

// Function to enable/disable team sections based on environment or config
export const getEnabledTeamSections = (): TeamSection[] => {
  const enableSpecialCommittee =
    process.env.NEXT_PUBLIC_ENABLE_SPECIAL_COMMITTEE === "true";
  const enableCoordinators =
    process.env.NEXT_PUBLIC_ENABLE_COORDINATORS_SECTION === "true";

  return defaultTeamConfig.filter((section) => {
    if (section.id === "special_committee" && !enableSpecialCommittee) {
      return false;
    }
    if (section.id === "coordinators" && !enableCoordinators) {
      return false;
    }
    return true;
  });
};
