"use client";

import { useState } from "react";

//style
import "./fileComponent.scss";

interface FileComponentProps {
  label: string;
  accept: string;
  onFileChange: (files: File[]) => void; // Pass file as an array
}

export default function ImageComponent({ label, accept, onFileChange }: FileComponentProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Only one file for ImageComponent

    if (file) {
      setFileName(file.name);
      onFileChange([file]); // Pass the file as an array to the parent

      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    } else {
      setFileName(null);
      setFilePreview(null);
    }
  };

  return (
    <div className="fileComponent">
      <label className="fileDropArea">
        <input type="file" accept={accept} onChange={handleFileChange} hidden />
        {filePreview ? (
          <img src={filePreview} alt="Preview" className="filePreview" />
        ) : (
          <p className="placeholderText">
            Drag & Drop {label} Here
            <br /> or <br />
            Click to Upload
          </p>
        )}
      </label>
      {fileName && <p className="fileName">{fileName}</p>}
    </div>
  );
}
