"use client";

export const dynamic = "force-dynamic"; // ✅ Prevents pre-rendering issues

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SendCertificateForm from "@/component/sendCertificateForm";
import SendCertificateTable from "@/component/sendCertificateTable";

interface FormData {
  email: string;
  course_id: string;
  user_id: string;
  certificateFile: File | null;
}

export default function SendCertificatePage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    course_id: "",
    user_id: "",
    certificateFile: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false); // ✅ Prevents SSR issues

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isClient) return; // ✅ Ensures it runs only on client-side

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
      const response = await fetch("https://ybdigitalx.com/vivi_backend/send_certificate.php", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      Swal.fire({
        title: data.status === "success" ? "Success!" : "Error!",
        text: data.message || (data.status === "success" ? "Certificate sent successfully!" : "Error while sending certificate."),
        icon: data.status === "success" ? "success" : "error",
        confirmButtonText: "OK",
      });

      if (data.status === "success") {
        setFormData({ email: "", course_id: "", user_id: "", certificateFile: null });
      }
    } catch (error) {
      Swal.fire({
        title: "Unexpected Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent rendering on the server to avoid SSR issues.
  if (!isClient) return null; // Prevents SSR errors

  return (
    <div className="sendCertificatePage">
      <SendCertificateForm 
        formData={formData} 
        setFormData={setFormData} 
        handleFormSubmit={handleFormSubmit} 
        loading={loading} 
        message={message} 
      />
      <SendCertificateTable setFormData={setFormData} />
    </div>
  );
}
