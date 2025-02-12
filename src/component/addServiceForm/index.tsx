"use client";

import React, { useState } from "react";
import InputComponent from "@/component/inputComponent";
import TextAreaComponent from "@/component/textAreaComponent";
import FileComponent from "@/component/fileComponent";

//style
import "./addServiceForm.scss";

export default function AddServiceForm() {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    imageFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.serviceName);
    formDataToSend.append("contents", formData.description);
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/add_service.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Service added successfully!");
        setFormData({
          serviceName: "",
          description: "",
          imageFile: null,
        });
      } else {
        setMessage("Error while inserting data into database.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addServiceForm">
      <form onSubmit={handleSubmit}>
        <div className="inputFields">
          <div className="formGroup">
            <label className="font-inter" htmlFor="serviceName">
              Service Name
            </label>
            <InputComponent name="serviceName" value={formData.serviceName} onChange={handleChange} />
          </div>
          <div className="formGroup">
            <label className="font-inter" htmlFor="description">
              Description
            </label>
            <TextAreaComponent name="description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit" className="saveButton" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="imageUpload">
          <FileComponent label="Drag & Drop or Upload Photo" accept="image/*" onFileChange={handleFileChange} />
        </div>
      </form>
      {message && <p className="responseMessage">{message}</p>}
    </div>
  );
}