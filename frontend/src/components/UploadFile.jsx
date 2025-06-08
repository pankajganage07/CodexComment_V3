import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("java"); // Default file type
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return toast.error("Please upload a file!");

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // To handle the returned file as a Blob
      });

      const modifiedFile = new Blob([response.data], { type: file.type });
      const downloadUrl = URL.createObjectURL(modifiedFile);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name; // Download with the original name
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("File uploaded and comments generated successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload and modify the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Fixed Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/home-bg.jpg')", zIndex: -1 }}></div>

      {/* ✅ Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <div className="bg-gray-800/80 backdrop-blur-lg shadow-lg rounded-lg p-6 w-96">
          <h2 className="text-2xl font-bold text-center text-cyan-500 mb-4">Upload Your File</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select 
              value={fileType} 
              onChange={handleFileTypeChange} 
              className="block w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none"
            >
              <option value="java">Java</option>
              <option value="py">Python</option>
              <option value="net">.NET</option>
              <option value="xml">XML</option>
            </select>
            
            <input
              type="file"
              onChange={handleFileChange}
              accept={`.${fileType}`}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-white font-medium rounded-lg ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
