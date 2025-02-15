"use client";

import React, { useState } from "react";
import InputComponent from "@/component/inputComponent";
import FileComponent from "@/component/fileComponent";
import "./sendCertificateForm.scss";

export default function SendCertificateForm() {
  const [formData, setFormData] = useState({
    email: "",
    certificateFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, certificateFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    if (formData.certificateFile) {
      formDataToSend.append("certificate", formData.certificateFile);
    }

    try {
      const response = await fetch("https://your-api-endpoint.com/send_certificate", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Certificate sent successfully!");
        setFormData({ email: "", certificateFile: null });
      } else {
        setMessage("Error while sending certificate.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sendCertificateForm">
      <h2>SEND CERTIFICATE</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Email</label>
          <InputComponent name="email" value={formData.email} onChange={handleChange} />
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
