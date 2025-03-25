"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import dynamic from "next/dynamic";
import "./videoUpload.scss";
import ImageComponent from "@/component/imageComponent";

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
  videoFiles: File[];
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    contents: "",
    category: "",
    imageFile: null,
    videoFiles: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch courses and categories on mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/course_table.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Failed to load courses.");
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/category_table.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories.");
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file changes (image and video)
  const handleFileChange = (file: File | File[] | null, type: "imageFile" | "videoFiles") => {
    if (type === "videoFiles" && Array.isArray(file)) {
      setFormData((prev) => ({
        ...prev,
        videoFiles: file,
      }));
    } else if (type === "imageFile" && file instanceof File) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("courseName", formData.title);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.contents);
    formDataToSend.append("categoryId", formData.category);

    if (formData.imageFile) {
      formDataToSend.append("imageFile", formData.imageFile);
    }

    if (formData.videoFiles.length > 0) {
      formData.videoFiles.forEach((file) => {
        formDataToSend.append("videoFiles[]", file);
      });
    }

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/video_upload.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Course and videos uploaded successfully!");
        resetForm();
        fetchCourses();
      } else {
        setMessage(data.message || "Error while uploading course.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form data after successful upload
  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      contents: "",
      category: "",
      imageFile: null,
      videoFiles: [],
    });
  };

  return (
    <div className="videoUpload">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="inputComponents">
            <div className="formGroup">
              <label htmlFor="title">Title</label>
              <InputComponent name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label htmlFor="price">Price</label>
              <InputComponent name="price" value={formData.price} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label htmlFor="category">Category</label>
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
              <label htmlFor="contents">Description</label>
              <TextAreaComponent name="contents" value={formData.contents} onChange={handleChange} />
            </div>
          </div>

          <div className="files">
            <FileComponent
              label="Videos"
              accept="video/*"
              multiple={true}
              onFileChange={(files: File[]) => handleFileChange(files, "videoFiles")}
            />
            <ImageComponent label="Image" accept="image/*" onFileChange={(file) => handleFileChange(file, "imageFile")} />
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
