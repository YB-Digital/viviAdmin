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
      {fileInputs.length > 0 && (
        <div>
          {fileInputs.map((files, index) => (
            <div key={index} className="fileBox">
              <div className="fileDropArea">
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, index)}
                  hidden
                  multiple={multiple} // Enable multiple file selection
                />
                {files.length > 0 ? (
                  files.map((file, fileIndex) => (
                    <div key={fileIndex}>
                      <p>{index + 1}) {file.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="placeholderText">
                    Drag & Drop {label} Here
                    <br /> or <br />
                    Click to Upload
                  </p>
                )}
              </div>
              {/* Add new input for more videos */}
              <button type="button" onClick={addFileInput}>Add another video</button>
            </div>
          ))}
        </div>
      )}
      {fileInputs.length === 0 && (
        <div className="fileBox">
          <div className="fileDropArea">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e, 0)}
              hidden
              multiple={multiple} // Enable multiple file selection
            />
            <p className="placeholderText">
              Drag & Drop {label} Here
              <br /> or <br />
              Click to Upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
