'use client'

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import SendCertificateForm from '@/component/sendCertificateForm';
import SendCertificateTable from '@/component/sendCertificateTable';

// Define the types for your form state
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
      const response = await fetch("https://viviacademy.de/admin/vivi_Adminbackend/send_certificate.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        Swal.fire({
          title: 'Success!',
          text: 'Certificate sent successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setFormData({ email: "", course_id: "", user_id: "", certificateFile: null });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Error while sending certificate.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Unexpected Error',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
      <SendCertificateTable setFormData={setFormData} />
    </div>
  );
}
