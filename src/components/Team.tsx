"use client";
import React from "react";
import { FocusCards } from "./ui/focus-cards";
import { getEnabledTeamSections, TeamMember } from "@/config/team";
import { organizationConfig } from "@/config/organization";

// Interface for FocusCards component compatibility
interface FocusCard {
  title: string;
  role: string;
  disc: string;
  src: string;
}

const Team: React.FC = () => {
  // Check if team section is enabled
  if (!organizationConfig.features.enableTeamSection) {
    return null;
  }

  const teamSections = getEnabledTeamSections();

  // Convert team members to FocusCard format
  const convertToFocusCards = (members: TeamMember[]): FocusCard[] => {
    return members.map((member) => ({
      title: member.name,
      role: member.role,
      disc: member.description || "",
      src: member.image,
    }));
  };

  return (
    <section className="lg:min-h-screen flex-col flex text-white lg:px-6 lg:py-10 items-center justify-center backdrop-blur-[1px] m-10">
      {teamSections.map((section, index) => (
        <div key={section.id} className={index > 0 ? "mt-10" : ""}>
          <h3
            className={`text-center text-4xl font-bold ${section.color} mb-4 drop-shadow-xl ${section.shadowColor}`}
          >
            {section.title}
          </h3>
          {section.description && (
            <p className="text-center text-gray-300 mb-6 max-w-2xl mx-auto">
              {section.description}
            </p>
          )}
          <FocusCards cards={convertToFocusCards(section.members)} />
        </div>
      ))}
    </section>
  );
};

export default Team;
