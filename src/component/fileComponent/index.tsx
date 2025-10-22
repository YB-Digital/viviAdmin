import { useState, useRef } from "react";
import "./fileComponent.scss";

interface FileComponentProps {
  label: string;
  accept: string;
  multiple?: boolean;
  onFileChange: (files: File[]) => void;
}

export default function FileComponent({
  label,
  accept,
  multiple = false,
  onFileChange,
}: FileComponentProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onFileChange(selectedFiles); // Parent’a aktar
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fileComponent">
      <label className="fileDropArea">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          ref={fileInputRef}
          onChange={handleChange}
        />
        <p onClick={triggerFileInput}>
          {files.length
            ? files.map((f) => f.name).join(", ")
            : "Click to select video(s)"}
        </p>
      </label>
    </div>
  );
}
