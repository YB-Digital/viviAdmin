"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import InputComponent from "@/component/inputComponent";
import TextAreaComponent from "@/component/textAreaComponent";
import CourseTableForPage from "@/component/courseTable/CourseTableForPage";
import SelectComponent from "@/component/selectComponent";

interface Category {
  id: string;
  name: string;
}

interface VideoOption {
  value: string;
  label: string;
}

export default function CoursesPage() {
  const [formData, setFormData] = useState({
    title: "",
    thumbnailUrl: "",
    description: "",
    shortDescription: "",
    price: "",
    videoIds: [] as string[],
    targetAudience: [""],
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [videoOptions, setVideoOptions] = useState<VideoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchVideos();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://api.viviacademy.xyz/api/categories/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      let categoryArray: Category[] = [];
      if (Array.isArray(result)) {
        categoryArray = result.map((item: any) => ({
          id: item.id || item.data?.id,
          name: item.name || item.data?.name,
        })).filter((cat: any) => cat.id && cat.name);
      } else if (Array.isArray(result.data)) {
        categoryArray = result.data.map((item: any) => ({
          id: item.id || item.data?.id,
          name: item.name || item.data?.name,
        })).filter((cat: any) => cat.id && cat.name);
      }
      setCategories(categoryArray);
    } catch (error) {
      setMessage("Kategori yüklenemedi");
    }
  };

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://api.viviacademy.xyz/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      const videos = (result.data || []).map((v: any) => ({
        value: v.id,
        label: v.title || v.id,
      }));
      setVideoOptions(videos);
    } catch (error) {
      setMessage("Videolar yüklenemedi");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudienceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, targetAudience: e.target.value.split(",").map(v => v.trim()).filter(Boolean) }));
  };

  const handleVideoSelect = (selected: any) => {
    setFormData((prev) => ({ ...prev, videoIds: selected ? selected.map((s: any) => s.value) : [] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription || formData.description.substring(0, 50),
      description: formData.description,
      price: formData.price || 0,
      imagePath: formData.thumbnailUrl,
      videoIds: formData.videoIds,
      targetAudience: formData.targetAudience,
      categoryId: formData.categoryId,
    };
    try {
      const response = await fetch("https://api.viviacademy.xyz/api/courses", {
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
          shortDescription: "",
          price: "",
          videoIds: [],
          targetAudience: [""],
          categoryId: "",
        });
      } else {
        setMessage(data.message || "Kurs oluşturulamadı!");
      }
    } catch (error) {
      setMessage("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courseCreatePage">
      <h2>Kurs Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Kurs Başlığı</label>
          <InputComponent name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label>Thumbnail URL</label>
          <InputComponent name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label>Kısa Açıklama</label>
          <InputComponent name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label>Açıklama</label>
          <TextAreaComponent name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label>Fiyat</label>
          <InputComponent name="price" value={formData.price} onChange={handleChange} type="number" />
        </div>
        <div className="formGroup">
          <label>Kategori</label>
          <SelectComponent
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />
        </div>
        <div className="formGroup">
          <label>Videolar</label>
          <Select
            isMulti
            name="videoIds"
            options={videoOptions}
            value={videoOptions.filter((opt) => formData.videoIds.includes(opt.value))}
            onChange={handleVideoSelect}
            placeholder="Videoları seçin"
          />
        </div>
        <div className="formGroup">
          <label>Hedef Kitle (virgülle ayır)</label>
          <InputComponent
            name="targetAudience"
            value={formData.targetAudience.join(",")}
            onChange={handleAudienceChange}
            placeholder="hedef1,hedef2,hedef3"
          />
        </div>
        <button type="submit" disabled={loading}>{loading ? "Oluşturuluyor..." : "Kursu Kaydet"}</button>
      </form>
      {message && <p className="responseMessage">{message}</p>}
      <CourseTableForPage />
    </div>
  );
}
