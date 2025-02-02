import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "@headlessui/react";
import { UploadCloud, X } from "lucide-react";
import PropTypes from "prop-types"; 

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle file drop
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setError("Invalid file. Please upload a .xlsx file under 2MB.");
      return;
    }
    setFile(acceptedFiles[0]);
    setError("");
  };

  // Configure useDropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB file size limit
    multiple: false,
  });

  const handleFileUpload = async () => {
  if (!file) {
    console.log("No file selected");  // ✅ Debugging log
    return;
  }

  console.log("Uploading file:", file.name);  // ✅ Debugging log

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Server Response:", data);  // ✅ Debugging log

    if (data.errors && data.errors.length > 0) {
      setValidationErrors(data.errors);
      setIsModalOpen(true);
    } else {
      onFileUpload(data.saved);
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        {...getRootProps()}
        className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white text-center cursor-pointer hover:border-blue-500"
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
        <p className="mt-2 text-gray-700">
          Drag & drop an .xlsx file here, or click to select one.
        </p>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {file && (
        <div className="mt-2 flex items-center gap-2 bg-gray-200 p-2 rounded-md">
          <span className="text-sm">{file.name}</span>
          <X className="w-4 h-4 cursor-pointer text-red-500" onClick={() => setFile(null)} />
        </div>
      )}

      <button onClick={handleFileUpload} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
        Upload File
      </button>

      {/* Modal for Errors */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold">Validation Errors</h2>
            <ul className="mt-2">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-500">
                  Sheet: {error.sheet}, Row {error.row}: {error.errors.join(", ")}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md">
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

//  Add PropTypes validation
FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired, // onFileUpload must be a function
};

export default FileUpload;
