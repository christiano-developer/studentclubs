import React from 'react';
import { FaFileAlt } from 'react-icons/fa';

interface EmptyFormsStateProps {
  onCreateForm: () => void;
}

const EmptyFormsState: React.FC<EmptyFormsStateProps> = ({ onCreateForm }) => {
  return (
    <div className="text-center py-12">
      <FaFileAlt className="text-gray-400 text-6xl mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No Forms Created
      </h3>
      <p className="text-gray-500 mb-4">
        Create your first custom form to get started.
      </p>
      <button
        onClick={onCreateForm}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create Form
      </button>
    </div>
  );
};

export default EmptyFormsState;