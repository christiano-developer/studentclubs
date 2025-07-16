"use client";

import { useEffect, useState } from "react";
import { submitContactMessage } from "@/lib/firebase";
import { ContactFormData, ContactFormErrors } from "@/types/auth";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";

export default function ContactPage() {
  const { settings, loading: settingsLoading } = useAppSettings();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Clear submit status after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if contact form is enabled
    if (!settings?.allowContactForm) {
      setSubmitStatus({
        type: "error",
        message: "Contact form is currently disabled. Please try again later.",
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitContactMessage(formData);
      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We will get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show contact form disabled message
  if (!settings?.allowContactForm) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 mt-15">
        <div className="max-w-md w-full ">
          <div className="bg-white/40 rounded-xl shadow-2xl p-8 text-center backdrop-blur-xs">
            <div className="mb-6 p-6 bg-red-50/50 backdrop-blur-xs border border-red-200 rounded-lg">
              <FaLock className="mx-auto text-red-500 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-3">
                Contact Form Unavailable
              </h2>
              <p className="text-red-700">
                The contact form is temporarily disabled. Please try again later
                or reach out through alternative methods.
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <FaInfoCircle className="text-blue-500" />
                <span>Alternative Contact Methods:</span>
              </div>
              <div className=" p-4 rounded-lg  ">
                <p className="font-medium">Email us directly:</p>
                <p className="text-blue-600">admin@orggec.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  w-full  min-h-fit mt-15">
      <div className="lg:w-[50vw] w-[90vw]  bg-white/10 px-10 backdrop-blur-xs py-5 rounded-lg  my-15">
        <h1 className="text-3xl font-bold  text-center">Contact Us</h1>

        {/* Success/Error Messages */}
        {submitStatus && (
          <div
            className={`mb-1 p-1 rounded-lg flex items-center ${
              submitStatus.type === "success"
                ? "bg-green-500/20 border border-green-500/50 text-green-100"
                : "bg-red-500/20 border border-red-500/50 text-red-100"
            }`}
          >
            {submitStatus.type === "success" ? (
              <FaCheckCircle className="text-green-400" />
            ) : (
              <FaExclamationTriangle className="text-red-400" />
            )}
            <span className="text-xs tracking-tighter ">
              {submitStatus.message}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded border-black/50 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-black/50 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 font-medium text-black">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border rounded px-3 border-black/50 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell us how we can help you..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
