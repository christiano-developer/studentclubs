import { createPortal } from "react-dom";
import {
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaIdCard,
  FaPhone,
  FaClock,
  FaFileDownload,
  FaEnvelope,
} from "react-icons/fa";
import { CustomForm, FormSubmission } from "@/types/auth";

interface FormSubmissionsModalProps {
  form: CustomForm;
  isOpen: boolean;
  onClose: () => void;
  submissions: FormSubmission[];
  loading: boolean;
}

const FormSubmissionsModal: React.FC<FormSubmissionsModalProps> = ({
  form,
  isOpen,
  onClose,
  submissions,
  loading,
}) => {
  if (!isOpen) return null;

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    // Create CSV headers
    const headers = [
      "Name",
      "Email",
      "Branch",
      "Year of Study",
      "org ID",
      "Phone Number",
      "Submitted At",
      ...form.customFields.map((field) => field.label),
    ];

    // Create CSV rows
    const rows = submissions.map((submission) => [
      submission.name,
      submission.email || "", // Handle existing submissions without email
      submission.branch,
      submission.yearOfStudy,
      submission.orgId,
      submission.phoneNumber,
      submission.submittedAt.toLocaleDateString() +
        " " +
        submission.submittedAt.toLocaleTimeString(),
      ...form.customFields.map(
        (field) => submission.customResponses[field.id] || "",
      ),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_submissions.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Form Submissions
            </h2>
            <p className="text-gray-600 mt-1">{form.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            {submissions.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFileDownload />
                <span>Export CSV</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Submissions Yet
              </h3>
              <p className="text-gray-500">
                This form hasn&apos;t received any submissions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Submission Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">
                      Total Submissions:{" "}
                    </span>
                    <span className="text-blue-900 font-bold">
                      {submissions.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">
                      First Submission:{" "}
                    </span>
                    <span className="text-blue-900">
                      {submissions[
                        submissions.length - 1
                      ]?.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">
                      Latest Submission:{" "}
                    </span>
                    <span className="text-blue-900">
                      {submissions[0]?.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Submission #{submissions.length - index}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1" />
                        {submission.submittedAt.toLocaleDateString()} at{" "}
                        {submission.submittedAt.toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">Name:</span>
                            <p className="font-medium">{submission.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <FaEnvelope className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Email:
                            </span>
                            <p className="font-medium">
                              {submission.email || "Not available"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <FaBuilding className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Branch:
                            </span>
                            <p className="font-medium">{submission.branch}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Year of Study:
                            </span>
                            <p className="font-medium">
                              {submission.yearOfStudy}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FaIdCard className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              org ID:
                            </span>
                            <p className="font-medium">{submission.orgId}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Phone:
                            </span>
                            <p className="font-medium">
                              {submission.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Custom Fields */}
                      {form.customFields.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900 border-b border-gray-300 pb-1">
                            Additional Information
                          </h5>
                          {form.customFields.map((field) => (
                            <div key={field.id}>
                              <span className="text-sm text-gray-600">
                                {field.label}:
                              </span>
                              <p className="font-medium">
                                {submission.customResponses[field.id] ||
                                  "Not provided"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default FormSubmissionsModal;
