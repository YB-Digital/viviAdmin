import { useState, useRef } from "react";

//style
import "./fileComponent.scss";

interface FileComponentProps {
  label: string;
  accept: string;
  multiple?: boolean; // Allow multiple files to be selected
  onFileChange: (files: File[]) => void; // Changed to handle an array of files
}

export default function FileComponent({
  label,
  accept,
  multiple = false,
  onFileChange,
}: FileComponentProps) {
  const [fileInputs, setFileInputs] = useState<File[][]>([]); // Array to store multiple file arrays
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs to each input

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
    // Trigger file input selection for the clicked index
    fileInputRefs.current[index]?.click(); // Manually trigger the file input
  };

  return (
    <div>
      <div className="fileComponent">
        <label className="fileDropArea">
          {/* Render each input field for files */}
          {fileInputs.map((_, index) => (
            <div key={index}>
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(e, index)}
                hidden
                multiple={multiple} // Enable multiple file selection
                ref={(el) => (fileInputRefs.current[index] = el)} // Attach ref to each input
              />
              {fileInputs[index].length > 0 ? (
                <p onClick={() => handleVideoClick(index)}>{index + 1}) {fileInputs[index][0].name}</p>
              ) : (
                <p onClick={() => handleVideoClick(index)}>{index + 1}) No video selected</p>
              )}
            </div>
          ))}
          <button type="button" onClick={addFileInput}>Add another video</button>
        </label>
      </div>

      {/* Display all selected video names below the boxes */}
      <div className="videoNames">
        {fileInputs.map((files, index) => (
          <p
            key={index}
            onClick={() => handleVideoClick(index)} // Trigger the file input for the clicked index
          >
            {index + 1}) {files[0]?.name || "No video selected"}
          </p>
        ))}
      </div>
    </div>
  );
}
