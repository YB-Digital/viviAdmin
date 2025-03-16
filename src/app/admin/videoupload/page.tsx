"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import dynamic from "next/dynamic";
import "./videoUpload.scss";

// ✅ Dinamik olarak bileşenleri import ediyoruz (SSR devre dışı)
const InputComponent = dynamic(() => import("@/component/inputComponent"), { ssr: false });
const TextAreaComponent = dynamic(() => import("@/component/textAreaComponent"), { ssr: false });
const FileComponent = dynamic(() => import("@/component/fileComponent"), { ssr: false });
const SelectComponent = dynamic(() => import("@/component/selectComponent"), { ssr: false });
const CourseTable = dynamic(() => import("@/component/courseTable"), { ssr: false });

interface Category {
  id: number;
  name: string;
}

interface Course {
  id: string;
  course_name: string;
  description: string;
  price: string;
  image: string;
  videos: string;
  category: string;
}

interface FormData {
  title: string;
  price: string;
  contents: string;
  category: string;
  imageFile: File | null;
  videoFile: File | null;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    contents: "",
    category: "",
    imageFile: null,
    videoFile: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false); // ✅ SSR önleme için

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true); // ✅ Sadece tarayıcıda çalıştır
      fetchCourses();
      fetchCategories();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/course_table.php");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Failed to load courses.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/category_table.php");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "price" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null, type: "imageFile" | "videoFile") => {
    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("contents", formData.contents);
    formDataToSend.append("category", formData.category);

    if (formData.imageFile) {
      formDataToSend.append("imageFile", formData.imageFile);
    }
    if (formData.videoFile) {
      formDataToSend.append("videoFile", formData.videoFile);
    }

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/video_upload.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Video uploaded successfully!");
        setFormData({
          title: "",
          price: "",
          contents: "",
          category: "",
          imageFile: null,
          videoFile: null,
        });
        fetchCourses();
      } else {
        setMessage(data.message || "Error while uploading video.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // ✅ Sunucu tarafında render edilmesini önler

  return (
    <div className="videoUpload">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="inputComponents">
            <div className="formGroup">
              <label className="font-inter" htmlFor="title">
                Title
              </label>
              <InputComponent name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label className="font-inter" htmlFor="price">
                Price
              </label>
              <InputComponent name="price" value={formData.price} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label className="font-inter" htmlFor="category">
                Category Name
              </label>
              <SelectComponent
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categories.map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))}
              />
            </div>
            <div className="formGroup">
              <label className="font-inter" htmlFor="contents">
                Contents
              </label>
              <TextAreaComponent name="contents" value={formData.contents} onChange={handleChange} />
            </div>
          </div>

          <div className="files">
            <FileComponent label="Video" accept="video/*" onFileChange={(file) => handleFileChange(file, "videoFile")} />
            <FileComponent label="Image" accept="image/*" onFileChange={(file) => handleFileChange(file, "imageFile")} />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Save"}
        </button>
      </form>
      {message && <p className="responseMessage">{message}</p>}

      <CourseTable courses={courses} refreshCourses={fetchCourses} />
    </div>
  );
}
