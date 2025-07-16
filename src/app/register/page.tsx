"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, checkorgIdExists } from "@/lib/firebase";
import {
  RegistrationFormData,
  RegistrationFormErrors,
  Branch,
  YearOfStudy,
  ValidationStatus,
} from "@/types/auth";
import {
  FaUpload,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaCalendarAlt,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const { user, loading, updateUserRegistration } = useAuth();
  const { settings, loading: settingsLoading } = useAppSettings();
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    orgId: "",
    gecIdCard: null,
    rollNumber: "",
    branch: Branch.ELECTRONICS_TELECOMMUNICATIONS,
    yearOfStudy: YearOfStudy.FIRST_YEAR,
  });
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!loading && !settingsLoading) {
      if (!user) {
        router.push("/auth");
      } else if (user.isRegistered) {
        router.push("/dashboard");
      } else if (!settings?.allowUserRegistration) {
        // Redirect to auth page if registration is disabled
        router.push("/auth");
      } else if (user) {
        // Only set form data if registration is allowed
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
        }));
      }
    }
  }, [user, loading, router, settings, settingsLoading]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: RegistrationFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.orgId.trim()) {
      newErrors.orgId = "Organization ID is required";
    } else if (!/^\d{9}$/.test(formData.orgId)) {
      newErrors.orgId = "Organization ID must be 9 digits";
    } else {
      // Check if Organization ID already exists
      try {
        const exists = await checkorgIdExists(formData.orgId, user?.uid);
        if (exists) {
          newErrors.orgId = "This Organization ID is already registered";
        }
      } catch (_error) {
        newErrors.orgId = "Error validating Organization ID";
      }
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    }

    if (!formData.gecIdCard) {
      newErrors.gecIdCard = "Institution ID card upload is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof RegistrationFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        gecIdCard: "File size must be less than 5MB",
      }));
      return false;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        gecIdCard: "File must be an image",
      }));
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      gecIdCard: file,
    }));

    if (errors.gecIdCard) {
      setErrors((prev) => ({
        ...prev,
        gecIdCard: undefined,
      }));
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      validateAndSetFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm()) || !user) return;

    setIsSubmitting(true);

    try {
      let gecIdCardUrl = "";

      if (formData.gecIdCard) {
        const storageRef = ref(
          storage,
          `org-id-cards/${user.uid}/${formData.gecIdCard.name}`,
        );
        const snapshot = await uploadBytes(storageRef, formData.gecIdCard);
        gecIdCardUrl = await getDownloadURL(snapshot.ref);
      }

      const registrationData = {
        name: formData.name,
        email: formData.email,
        orgId: formData.orgId,
        gecIdCardUrl,
        rollNumber: formData.rollNumber,
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
        createdAt: new Date(),
        updatedAt: new Date(),
        validationStatus: ValidationStatus.PENDING,
      };

      await updateUserRegistration(registrationData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading..." : "Loading settings..."}
          </p>
        </div>
      </div>
    );
  }

  // Show registration disabled message if setting is off
  if (!settings?.allowUserRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
              <FaLock className="mx-auto text-red-500 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-3">
                Registration Currently Disabled
              </h2>
              <p className="text-red-700">
                New user registration is temporarily unavailable. Please check
                back later or contact the administrator for assistance.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-6">
              <FaInfoCircle className="text-blue-500" />
              <span>This restriction does not affect existing users.</span>
            </div>

            <button
              onClick={() => router.push("/auth")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit bg-gradient-to-br from-blue-50 to-indigo-100 py-10 mt-15">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl p-4 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Registration
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="Enter your email"
                  readOnly
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIdCard className="inline mr-2" />
                  Organization ID
                </label>
                <input
                  type="text"
                  name="orgId"
                  value={formData.orgId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your 9-digit Organization ID"
                  maxLength={9}
                />
                {errors.orgId && (
                  <p className="mt-1 text-sm text-red-600">{errors.orgId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIdCard className="inline mr-2" />
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your roll number"
                />
                {errors.rollNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rollNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-2" />
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-200 h-8  text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(Branch).map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Year of Study
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className="w-full text-neutral-900 bg-neutral-200 h-8   px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(YearOfStudy).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUpload className="inline mr-2" />
                Institution ID Card Upload
              </label>
              <div
                className={`mt-1 flex justify-center px-2 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-200 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <FaUpload
                    className={`mx-auto h-12 w-12 transition-colors duration-200 ${
                      isDragOver ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p
                      className={`pl-1 transition-colors duration-200 ${
                        isDragOver
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {isDragOver ? "Drop your file here" : "or drag and drop"}
                    </p>
                  </div>
                  <p
                    className={`text-xs transition-colors duration-200 ${
                      isDragOver ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {formData.gecIdCard && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.gecIdCard.name}
                    </p>
                  )}
                </div>
              </div>
              {errors.gecIdCard && (
                <p className="mt-1 text-sm text-red-600">{errors.gecIdCard}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
