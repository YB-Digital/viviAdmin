"use client";

import { useState } from "react";

//style
import "./fileComponent.scss";

interface FileComponentProps {
  label: string;
  accept: string;
  multiple?: boolean; // Allow multiple files to be selected
  onFileChange: (files: File[]) => void; // Changed to handle an array of files
}

export default function FileComponent({ label, accept, multiple = false, onFileChange }: FileComponentProps) {
  const [fileNames, setFileNames] = useState<string[]>([]); // Array to hold file names
  const [filePreviews, setFilePreviews] = useState<string[]>([]); // Array to hold preview URLs

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files); // Convert FileList to an array
      const newFileNames = fileArray.map((file) => file.name); // Extract file names
      const newFilePreviews = fileArray.map((file) => URL.createObjectURL(file)); // Generate file previews

      setFileNames((prev) => [...prev, ...newFileNames]); // Add new file names to the list
      setFilePreviews((prev) => [...prev, ...newFilePreviews]); // Add new previews to the list

      // Pass the files to the parent component
    }
  };

  return (
    <div className="fileComponent">
      <label className="fileDropArea">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          hidden
          multiple={multiple} // Enable multiple file selection
        />
        {filePreviews.length > 0 ? (
          filePreviews.map((filePreview, index) => (
            <video key={index} src={filePreview} controls className="filePreview" />
          ))
        ) : (
          <p className="placeholderText">
            Drag & Drop {label} Here
            <br /> or <br />
            Click to Upload
          </p>
        )}
      </label>
      {fileNames.length > 0 && (
        <div className="fileNames">
          {fileNames.map((fileName, index) => (
            <p key={index} className="fileName">{fileName}</p>
          ))}
        </div>
      )}
    </div>
  );
}
