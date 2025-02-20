"use client";

import React, { useState, useEffect } from "react";
import InputComponent from "@/component/inputComponent";
import TextAreaComponent from "@/component/textAreaComponent";
import FileComponent from "@/component/fileComponent";

//style
import "./addServiceForm.scss";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface AddServiceFormProps {
  selectedService: Service | null;
  onServiceUpdate: () => void;
}

export default function AddServiceForm({ selectedService, onServiceUpdate }: AddServiceFormProps) {
  const [formData, setFormData] = useState({
    id: "", // Gizli ID inputu
    serviceName: "",
    description: "",
    imageFile: null as File | null,
    imageUrl: "", // Mevcut resmi göstermek için
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedService) {
      setFormData({
        id: selectedService.id,
        serviceName: selectedService.name,
        description: selectedService.description,
        imageFile: null,
        imageUrl: selectedService.image,
      });
    }
  }, [selectedService]);

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

    // Zorunlu alan kontrolü
    if (!formData.serviceName.trim() || !formData.description.trim()) {
      setMessage("Service Name and Description are required.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
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
      setMessage(data.message);

      if (data.status === "success") {
        setFormData({
          id: "",
          serviceName: "",
          description: "",
          imageFile: null,
          imageUrl: "",
        });
        onServiceUpdate();
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
        <input type="hidden" name="id" value={formData.id} />
        <div className="inputFields">
          <div className="formGroup">
            <label className="font-inter" htmlFor="serviceName">
              Service Name <span className="required">*</span>
            </label>
            <InputComponent name="serviceName" value={formData.serviceName} onChange={handleChange} />
          </div>
          <div className="formGroup">
            <label className="font-inter" htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <TextAreaComponent name="description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit" className="saveButton" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="imageUpload">
          {formData.imageUrl && <img src={formData.imageUrl} alt="Service" className="previewImage" />}
          <FileComponent label="Drag & Drop or Upload Photo" accept="image/*" onFileChange={handleFileChange} />
        </div>
      </form>
      {message && <p className="responseMessage">{message}</p>}
    </div>
  );
}