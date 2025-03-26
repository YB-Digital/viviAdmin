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
  const [fileInputs, setFileInputs] = useState<File[][]>([]); // Array to store multiple file arrays

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

  return (
    <div className="fileComponent">
      <label className="fileDropArea">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, fileInputs.length - 1)} // Ensure it updates the last index
          hidden
          multiple={multiple} // Enable multiple file selection
        />
        {fileInputs.length > 0 && (
          <div>
            {fileInputs.map((files, index) => (
              <div key={index}>
                {/* Display the video names with sequential numbering */}
                <p>{index + 1}) {files.map((file, fileIndex) => file.name).join(", ")}</p>
                
                {/* Add new input for more videos */}
                <button type="button" onClick={addFileInput}>Add another video</button>
              </div>
            ))}
          </div>
        )}
        {!fileInputs.length && (
          <p className="placeholderText">
            Drag & Drop {label} Here
            <br /> or <br />
            Click to Upload
          </p>
        )}
      </label>

      {/* List of all selected videos */}
      <div className="videoNames">
        {fileInputs.map((files, index) => (
          <p key={index}>{index + 1}) {files.map((file) => file.name).join(", ")}</p>
        ))}
      </div>
    </div>
  );
}
