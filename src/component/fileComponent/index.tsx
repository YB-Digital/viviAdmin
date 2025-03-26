"use client";

import { useState } from "react";

//style
import "./fileComponent.scss";  // You can optionally keep your custom styling here or remove it completely when using Tailwind.

interface FileComponentProps {
  label: string;
  accept: string;
  multiple?: boolean; // Allow multiple files to be selected
  onFileChange: (files: File[]) => void; // Changed to handle an array of files
}

export default function FileComponent({ label, accept, multiple = false, onFileChange }: FileComponentProps) {
  const [fileInputs, setFileInputs] = useState<File[][]>([]); // Array to store multiple file arrays
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null); // Track selected video index

  // Handle the file input change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files); // Convert FileList to an array

      // Update the corresponding file input index with the new files
      const updatedFileInputs = [...fileInputs];
      updatedFileInputs[index] = fileArray;

      setFileInputs(updatedFileInputs);

      // Pass the updated list of files to the parent component
      onFileChange(updatedFileInputs.flat()); // Flatten the file arrays and pass to parent
    }
  };

  // Add a new file input box when a file is selected
  const addFileInput = () => {
    setFileInputs((prev) => [...prev, []]); // Add a new empty array for new file input
  };

  // Handle video name click to trigger file input
  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index); // Update the index of the clicked video
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      <label className="fileDropArea bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, selectedVideoIndex !== null ? selectedVideoIndex : 0)}
          hidden
          multiple={multiple} // Enable multiple file selection
        />
        {fileInputs.length > 0 ? (
          <div className="space-y-2">
            {fileInputs.map((files, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Display the video names below the input box */}
                <p
                  onClick={() => handleVideoClick(index)}
                  className="text-center text-sm text-gray-700 cursor-pointer hover:text-blue-500"
                >
                  {index + 1}) {files.length > 0 ? files[0].name : "No file selected"}
                </p>
                <button
                  type="button"
                  onClick={addFileInput}
                  className="text-blue-500 text-sm hover:text-blue-700 mt-2"
                >
                  Add another video
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Drag & Drop {label} Here
            <br /> or <br />
            Click to Upload
          </p>
        )}
      </label>

      {/* Display all selected video names below the boxes */}
      <div className="space-y-2 mt-4">
        {fileInputs.map((files, index) => (
          <p key={index} className="text-sm text-gray-700 cursor-pointer hover:text-blue-500" onClick={() => handleVideoClick(index)}>
            {index + 1}) {files[0]?.name || "No video selected"}
          </p>
        ))}
      </div>
    </div>
  );
}
