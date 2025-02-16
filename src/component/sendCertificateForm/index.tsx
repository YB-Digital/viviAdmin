"use client";

import React, { useState } from "react";
import InputComponent from "@/component/inputComponent";
import FileComponent from "@/component/fileComponent";

//style
import "./sendCertificateForm.scss";

export default function SendCertificateForm() {
  const [formData, setFormData] = useState({
    email: "",
    certificateFile: null as File | null,
    course_id: "",
    user_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    formDataToSend.append("course_id", formData.course_id);
    formDataToSend.append("user_id", formData.user_id);
    if (formData.certificateFile) {
      formDataToSend.append("pdf", formData.certificateFile);
    }

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/send_certificate.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Certificate sent successfully!");
        setFormData({ email: "", certificateFile: null, course_id: "", user_id: "" });
      } else {
        setMessage(data.message || "Error while sending certificate.");
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
        <div className="formGroup">
          <label>Course ID</label>
          <InputComponent name="course_id" value={formData.course_id} onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label>User ID</label>
          <InputComponent name="user_id" value={formData.user_id} onChange={handleChange} />
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