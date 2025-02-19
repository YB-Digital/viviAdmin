"use client";

import React, { useState } from "react";
import SendCertificateForm from "@/component/sendCertificateForm";
import SendCertificateTable from "@/component/sendCertificateTable";

export default function SendCertificatePage() {
  const [formData, setFormData] = useState({
    email: "",
    course_id: "",
    user_id: "",
    certificateFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setFormData({ email: "", course_id: "", user_id: "", certificateFile: null });
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
    <div className="sendCertificatePage">
      <SendCertificateForm 
        formData={formData} 
        setFormData={setFormData} 
        handleFormSubmit={handleFormSubmit} 
        loading={loading} 
        message={message} 
      />
      <SendCertificateTable setFormData={setFormData} handleFormSubmit={handleFormSubmit} />
    </div>
  );
}
