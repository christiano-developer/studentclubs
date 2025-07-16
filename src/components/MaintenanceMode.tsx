import React from "react";
import { FaCog, FaWrench, FaClock, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";

interface MaintenanceModeProps {
  isAdmin?: boolean;
  onAdminAccess?: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  isAdmin = false,
  onAdminAccess,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full ">
        <div className="bg-white/10 rounded-xl shadow-blue-50 p-8 text-center  backdrop-blur-xs shadow-inner flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              width={80}
              height={80}
              src="/logos/main_logo.png"
              alt="Organization Logo"
              className="mx-auto h-16 w-auto"
            />
          </div>

          {/* Maintenance Icon */}
          <div className="mb-6 w-fit p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <FaWrench className="mx-auto text-orange-500 text-5xl mb-4" />
            <h1 className="text-3xl font-bold text-orange-800 mb-3">
              Under Maintenance
            </h1>
            <p className="text-orange-700">
              We&apos;re currently performing maintenance. We&apos;ll be back
              shortly!
            </p>
          </div>
          <div className="lg:flex lg:h-28 lg:flex-row flex-col justify-center items-center lg:space-x-10">
            {/* Estimated Time */}
            <div className=" bg-gray-50 p-4 rounded-lg h-full  items-center justify-center flex flex-col">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                <FaClock className="text-blue-500" />
                <span className="font-medium">Estimated Duration:</span>
              </div>
              <p className="text-gray-800 font-semibold">
                30 minutes - 2 hours
              </p>
            </div>

            {/* Contact Information */}

            <div className="bg-gray-50 p-4 rounded-lg h-full flex-col items-center flex justify-center">
              <div className="flex items-center justify-center space-x-2">
                <FaInfoCircle className="text-blue-500" />
                <span className="text-sm">
                  For urgent matters, contact us directly:
                </span>
              </div>

              <p className="text-blue-600"> Email: orgb@org.ac.in</p>
            </div>
          </div>

          {/* Admin Access */}
          {isAdmin && onAdminAccess && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onAdminAccess}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FaCog />
                <span>Admin Access</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Administrator access during maintenance
              </p>
            </div>
          )}

          {/* Status Updates */}
          <div className="mt-6 text-xs text-gray-500">
            <p>Last updated: {new Date().toLocaleString()}</p>
            <p className="mt-1">Thank you for your patience!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
