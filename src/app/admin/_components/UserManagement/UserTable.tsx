import React from "react";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { UserRegistration, ValidationStatus } from "@/types/auth";
import { UserStatusTab } from "./UserStatusTabs";

interface UserWithId extends UserRegistration {
  id: string;
}

interface UserTableProps {
  users: UserWithId[];
  statusTab: UserStatusTab;
  onViewUser: (user: UserWithId) => void;
  onValidateUser: (userId: string, status: ValidationStatus) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  statusTab,
  onViewUser,
  onValidateUser,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              org ID
            </th>
            <th className="hidden lg:flex text-left py-3 px-4 font-medium text-gray-700">
              Branch
            </th>
            <th className="hidden lg:flex text-left py-3 px-4 font-medium text-gray-700">
              Date
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((userData) => (
            <tr
              key={userData.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">{userData.name}</td>
              <td className="py-3 px-4">{userData.orgId}</td>
              <td className="py-3 px-4 hidden lg:flex">{userData.branch}</td>
              <td className="py-3 px-4 hidden lg:flex">
                {userData.createdAt.toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onViewUser(userData)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  title="View Details"
                >
                  <FaEye />
                </button>

                {/* Action buttons based on current tab and status */}
                {statusTab === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        onValidateUser(userData.id, ValidationStatus.APPROVED)
                      }
                      className="text-green-600 hover:text-green-800 mr-2"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() =>
                        onValidateUser(userData.id, ValidationStatus.REJECTED)
                      }
                      className="text-red-600 hover:text-red-800"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}

                {statusTab === "approved" && (
                  <button
                    onClick={() =>
                      onValidateUser(userData.id, ValidationStatus.REJECTED)
                    }
                    className="text-red-600 hover:text-red-800"
                    title="Reject"
                  >
                    <FaTimes />
                  </button>
                )}

                {statusTab === "rejected" && (
                  <button
                    onClick={() =>
                      onValidateUser(userData.id, ValidationStatus.APPROVED)
                    }
                    className="text-green-600 hover:text-green-800"
                    title="Approve"
                  >
                    <FaCheck />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
