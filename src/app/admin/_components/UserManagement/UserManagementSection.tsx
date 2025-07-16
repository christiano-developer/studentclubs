import React, { useState } from "react";
import { UserRegistration, ValidationStatus } from "@/types/auth";
import UserStatusTabs, { UserStatusTab } from "./UserStatusTabs";
import UserTable from "./UserTable";
import EmptyUserState from "./EmptyUserState";
import { FaSyncAlt } from "react-icons/fa";

interface UserWithId extends UserRegistration {
  id: string;
}

interface UserManagementSectionProps {
  users: UserWithId[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  onViewUser: (user: UserWithId) => void;
  onValidateUser: (userId: string, status: ValidationStatus) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  users,
  stats,
  onViewUser,
  onValidateUser,
  onRefresh,
  isRefreshing = false,
}) => {
  const [userStatusTab, setUserStatusTab] = useState<UserStatusTab>("pending");

  const getFilteredUsers = () => {
    switch (userStatusTab) {
      case "pending":
        return users.filter(
          (user) => user.validationStatus === ValidationStatus.PENDING,
        );
      case "approved":
        return users.filter(
          (user) => user.validationStatus === ValidationStatus.APPROVED,
        );
      case "rejected":
        return users.filter(
          (user) => user.validationStatus === ValidationStatus.REJECTED,
        );
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="bg-gray-50 rounded-lg lg:p-6 p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          User Registrations
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FaSyncAlt
              className={`${isRefreshing ? "animate-spin" : ""} text-xs`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        )}
      </div>

      <UserStatusTabs
        activeTab={userStatusTab}
        onTabChange={setUserStatusTab}
        stats={stats}
      />

      {filteredUsers.length === 0 ? (
        <EmptyUserState statusTab={userStatusTab} />
      ) : (
        <UserTable
          users={filteredUsers}
          statusTab={userStatusTab}
          onViewUser={onViewUser}
          onValidateUser={onValidateUser}
        />
      )}
    </div>
  );
};

export default UserManagementSection;
