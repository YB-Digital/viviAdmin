"use client";

import React, { useState } from "react";

//style
import "./fileComponent.scss";

interface FileComponentProps {
  label: string;
  accept: string;
  onFileChange: (file: File | null) => void;
}

export default function FileComponent({ label, accept, onFileChange }: FileComponentProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFileName(file.name);
      onFileChange(file);

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
          accept.startsWith("image") ? (
            <img src={filePreview} alt="Preview" className="filePreview" />
          ) : accept.startsWith("video") ? (
            <video src={filePreview} controls className="filePreview" />
          ) : null
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
