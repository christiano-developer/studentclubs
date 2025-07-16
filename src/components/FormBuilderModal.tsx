"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FormBuilderData, FieldType, CustomField } from "@/types/auth";
import {
  FaTimes,
  FaPlus,
  FaTrash,
  FaGripVertical,
  FaEye,
  FaSave,
} from "react-icons/fa";

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormBuilderData) => Promise<void>;
  initialData?: FormBuilderData;
  isUpdating: boolean;
}

const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<FormBuilderData>({
    title: "",
    description: "",
    customFields: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        customFields: [],
      });
    }
    setErrors({});
    setShowPreview(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Form title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Form description is required";
    }

    // Validate custom fields
    formData.customFields.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`field_${index}_label`] = "Field label is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const addCustomField = () => {
    const newField = {
      label: "",
      type: FieldType.TEXT,
      required: false,
      order: formData.customFields.length,
    };
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (
    index: number,
    updates: Partial<Omit<CustomField, "id">>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field, i) =>
        i === index ? { ...field, ...updates } : field,
      ),
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.customFields.length - 1)
    ) {
      return;
    }

    const newFields = [...formData.customFields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];

    setFormData((prev) => ({
      ...prev,
      customFields: newFields,
    }));
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Form" : "Create New Form"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  showPreview
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaEye className="inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isUpdating}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showPreview ? (
            <div className="space-y-6">
              {/* Basic Form Info */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter form title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter form description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Custom Fields Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Custom Fields
                  </h3>
                  <button
                    onClick={addCustomField}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus />
                    <span>Add Field</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.customFields.map((field, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => moveField(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaGripVertical />
                          </button>
                          <button
                            onClick={() => moveField(index, "down")}
                            disabled={
                              index === formData.customFields.length - 1
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaGripVertical />
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Field Label *
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                updateCustomField(index, {
                                  label: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter field label"
                            />
                            {errors[`field_${index}_label`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors[`field_${index}_label`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Field Type
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateCustomField(index, {
                                  type: e.target.value as FieldType,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value={FieldType.TEXT}>Text</option>
                              <option value={FieldType.NUMBER}>Number</option>
                            </select>
                          </div>

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateCustomField(index, {
                                    required: e.target.checked,
                                  })
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                Required
                              </span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={() => removeCustomField(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.customFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No custom fields added yet.</p>
                      <p className="text-sm">
                        Click &quot;Add Field&quot; to create custom fields for
                        your form.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Form Preview
                </h3>
                <p className="text-blue-700 text-sm">
                  This is how the form will appear to users.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {formData.title || "Form Title"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formData.description || "Form description"}
                </p>

                <div className="space-y-4">
                  {/* Mandatory Fields Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch *
                      </label>
                      <select
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      >
                        <option>Computer Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Study *
                      </label>
                      <select
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      >
                        <option>3rd Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        org ID *
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Custom Fields Preview */}
                  {formData.customFields.map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label || `Custom Field ${index + 1}`}
                        {field.required && " *"}
                      </label>
                      <input
                        type={field.type}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        placeholder={`Enter ${field.label || "value"}`}
                      />
                    </div>
                  ))}

                  {/* Terms Checkbox Preview */}
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" disabled className="mt-1" />
                    <label className="text-sm text-gray-700">
                      I agree to the terms and conditions *
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSave />
            <span>
              {isUpdating
                ? "Saving..."
                : initialData
                  ? "Update Form"
                  : "Create Form"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default FormBuilderModal;
