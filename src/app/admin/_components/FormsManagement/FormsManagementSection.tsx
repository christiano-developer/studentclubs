import React from 'react';
import { FaPlus, FaSyncAlt } from 'react-icons/fa';
import { CustomForm, FormStatus } from '@/types/auth';
import FormsTable from './FormsTable';
import EmptyFormsState from './EmptyFormsState';

interface FormsManagementSectionProps {
  forms: CustomForm[];
  loadingForms: boolean;
  onCreateForm: () => void;
  onEditForm: (form: CustomForm) => void;
  onToggleFormStatus: (formId: string, currentStatus: FormStatus) => void;
  onDeleteForm: (formId: string) => void;
  onViewSubmissions: (form: CustomForm) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const FormsManagementSection: React.FC<FormsManagementSectionProps> = ({
  forms,
  loadingForms,
  onCreateForm,
  onEditForm,
  onToggleFormStatus,
  onDeleteForm,
  onViewSubmissions,
  onRefresh,
  isRefreshing = false,
}) => {
  if (loadingForms) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Forms Management
          </h2>
          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''} text-xs`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}
            <button
              onClick={onCreateForm}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaPlus />
              <span>Create New Form</span>
            </button>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Forms Management
        </h2>
        <div className="flex items-center space-x-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''} text-xs`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
          <button
            onClick={onCreateForm}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaPlus />
            <span>Create New Form</span>
          </button>
        </div>
      </div>

      {forms.length === 0 ? (
        <EmptyFormsState onCreateForm={onCreateForm} />
      ) : (
        <FormsTable
          forms={forms}
          onEditForm={onEditForm}
          onToggleFormStatus={onToggleFormStatus}
          onDeleteForm={onDeleteForm}
          onViewSubmissions={onViewSubmissions}
        />
      )}
    </div>
  );
};

export default FormsManagementSection;