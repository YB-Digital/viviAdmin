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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileChange(file);
  };

  return (
    <div className="fileComponent">
      <label className="fileDropArea">
        <input type="file" accept={accept} onChange={handleFileChange} hidden />
        {fileName ? (
          <p className="fileName">{fileName}</p>
        ) : (
          <p className="placeholderText">
            Drag & Drop {label} Here
            <br /> or <br />
            Click to Upload
          </p>
        )}
      </label>
    </div>
  );
}
