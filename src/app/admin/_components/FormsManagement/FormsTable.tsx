import React from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash, FaUsers } from 'react-icons/fa';
import { CustomForm, FormStatus } from '@/types/auth';

interface FormsTableProps {
  forms: CustomForm[];
  onEditForm: (form: CustomForm) => void;
  onToggleFormStatus: (formId: string, currentStatus: FormStatus) => void;
  onDeleteForm: (formId: string) => void;
  onViewSubmissions: (form: CustomForm) => void;
}

const FormsTable: React.FC<FormsTableProps> = ({
  forms,
  onEditForm,
  onToggleFormStatus,
  onDeleteForm,
  onViewSubmissions,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Form Title
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Submissions
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Created
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr
              key={form.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {form.title}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {form.description}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.status === FormStatus.ACTIVE
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {form.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium">
                  {form.submissions || 0}
                </span>
              </td>
              <td className="py-3 px-4">
                {form.createdAt.toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewSubmissions(form)}
                    className="text-purple-600 hover:text-purple-800"
                    title="View Submissions"
                  >
                    <FaUsers />
                  </button>
                  <button
                    onClick={() => onEditForm(form)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Form"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onToggleFormStatus(form.id, form.status)}
                    className={`${
                      form.status === FormStatus.ACTIVE
                        ? "text-gray-600 hover:text-gray-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                    title={
                      form.status === FormStatus.ACTIVE
                        ? "Deactivate"
                        : "Activate"
                    }
                  >
                    {form.status === FormStatus.ACTIVE ? (
                      <FaTimes />
                    ) : (
                      <FaCheck />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteForm(form.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Form"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable;