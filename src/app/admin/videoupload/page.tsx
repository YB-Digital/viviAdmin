"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import dynamic from "next/dynamic";
import "./videoUpload.scss";
import VideoTable from "@/component/videoTable";

const InputComponent = dynamic(() => import("@/component/inputComponent"), {
  ssr: false,
});
const TextAreaComponent = dynamic(
  () => import("@/component/textAreaComponent"),
  { ssr: false }
);
const FileComponent = dynamic(() => import("@/component/fileComponent"), {
  ssr: false,
});
const SelectComponent = dynamic(() => import("@/component/selectComponent"), {
  ssr: false,
});
const CourseTable = dynamic(() => import("@/component/courseTable"), {
  ssr: false,
});

interface Category {
  id: string;
  name: string;
}

interface Video {
  video_order: number;
  video_path: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number | string;
  imagePath: string;
  trainerName: string;
  videos: Video[];
  categoryName?: string;
}

interface FormDataType {
  title: string;
  thumbnailUrl: string;
  description: string;
  categoryId: string;
  file: File[];
  videoSections: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    thumbnailUrl: "",
    description: "",
    categoryId: "",
    file: [],
    videoSections: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchCourses();
      fetchCategories();
    }
    console.log("Formdata:", formData);
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token bulunamadı");

      const response = await fetch("https://api.viviacademy.xyz/api/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      const courseArray = (Array.isArray(result.data) ? result.data : []).map(
        (item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price || 0,
          imagePath: item.thumbnailUrl || "",
          trainerName: item.trainerName || "Unknown",
          videos: item.videos || [],
          categoryName: item.category?.name || "Unknown", // burada ekledik
        })
      );

      setCourses(courseArray);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setMessage("Failed to load courses.");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token bulunamadı");

      const response = await fetch(
        "https://api.viviacademy.xyz/api/categories/getall",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      const categoryArray = (Array.isArray(result) ? result : [])
        .filter((item: any) => item.success && item.data)
        .map((item: any) => ({ id: item.data.id, name: item.data.name }));

      setCategories(categoryArray);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      setMessage("Failed to load categories.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, file: files }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Video dosyası zorunluysa kontrol edebilirsiniz
    // if (!formData.file.length) {
    //   setMessage("Lütfen bir video dosyası seçin!");
    //   setLoading(false);
    //   return;
    // }

    // Video dosyası yükleme ayrı bir endpoint ile yapılmalı, burada sadece kurs oluşturulacak
    // Video ID'leri, video yükleme sonrası alınarak eklenmeli

    // Şimdilik videoIds alanı boş gönderilecek
    const payload = {
      title: formData.title,
      shortDescription: formData.description.substring(0, 50),
      description: formData.description,
      price: 0, // Fiyat alanı eklenebilir
      imagePath: formData.thumbnailUrl,
      videoIds: [], // Video yükleme sonrası doldurulmalı
      targetAudience: [], // İstenirse eklenebilir
      categoryId: formData.categoryId,
    };

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Kurs başarıyla oluşturuldu!");
        setFormData({
          title: "",
          thumbnailUrl: "",
          description: "",
          categoryId: "",
          file: [],
          videoSections: "",
        });
      } else {
        setMessage(data.message || "Kurs oluşturulamadı!");
      }
    } catch (error) {
      console.error("Kurs oluşturma hatası:", error);
      setMessage("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  console.log("courses", courses);

  return (
    <div className="videoUpload">
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <div className="inputComponents">
            <div className="formGroup">
              <label>Title</label>
              <InputComponent
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>Thumbnail URL</label>
              <InputComponent
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>Category</label>
              <SelectComponent
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
              />
            </div>
            <div className="formGroup">
              <label>Description</label>
              <TextAreaComponent
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>Video Sections</label>
              <TextAreaComponent
                name="videoSections"
                value={formData.videoSections}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="files">
            <FileComponent
              label="Videos"
              accept="video/*"
              multiple
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Save"}
        </button>
      </form>

      {message && <p className="responseMessage">{message}</p>}

      {/* <CourseTable
        courses={courses.map((course) => ({
          ...course,
          imagePath: course.imagePath || "/placeholder.png",
        }))}
        refreshCourses={fetchCourses}
      /> */}
      <VideoTable />
    </div>
  );
}