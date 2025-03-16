"use client";

import React from "react";
import InputComponent from "@/component/inputComponent";
import FileComponent from "@/component/fileComponent";

//style
import "./sendCertificateForm.scss";

interface SendCertificateFormProps {
  formData: {
    email: string;
    certificateFile: File | null;
    course_id: string;
    user_id: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; certificateFile: File | null; course_id: string; user_id: string }>>;
  handleFormSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  message: string | null;
}

export default function SendCertificateForm({ formData, setFormData, handleFormSubmit, loading, message }: SendCertificateFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, certificateFile: file }));
  };

  return (
    <div className="sendCertificateForm">
      <h2>Send Certificate</h2>
      <form onSubmit={handleFormSubmit} className="certificateForm">
        <div className="formGroup">
          <label>Email</label>
          <InputComponent name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="fileUpload">
          <FileComponent label="Drag & Drop or Click to Upload" accept="application/pdf" onFileChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading} className="sendButton">
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {message && <p className="responseMessage">{message}</p>}
    </div>
  );
}
