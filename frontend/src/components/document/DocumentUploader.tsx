"use client";

import { useState } from "react";

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const DocumentUploader = ({
  onUpload,
  isLoading = false,
}: DocumentUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      await onUpload(files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files?.[0]) {
      await onUpload(files[0]);
    }
  };

  return (
    <div
      className={`relative h-full flex flex-col justify-center items-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
    ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
    ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"}
  `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        disabled={isLoading}
        accept=".pdf,.doc,.docx,.txt"
      />
      <p className="mt-2 text-sm text-gray-500">
        Drag and drop your document here, or click to select
      </p>
      <p className="mt-1 text-xs text-gray-400">Supports PDF files</p>
    </div>
  );
};

export default DocumentUploader;
