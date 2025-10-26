"use client";
import React, { useEffect, useState } from "react";

const AddCourses = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: "",
    imagePath: "",
    targetAudience: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  // Google Drive linkini direct linke çevir
  const getDriveImageUrl = (url) => {
    if (!url) return "";

    console.log("Original URL:", url);

    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (!match) return url;

    const fileId = match[1];

    const finalUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    console.log("Final URL:", finalUrl);

    return finalUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [vidRes, courseRes] = await Promise.all([
          fetch("https://api.viviacademy.xyz/api/videos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.viviacademy.xyz/api/courses/getall", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const vidData = await vidRes.json();
        const courseData = await courseRes.json();

        if (Array.isArray(vidData.data)) setVideos(vidData.data);

        let parsedCourses = [];
        if (Array.isArray(courseData)) {
          parsedCourses = courseData.map((item) => item.data);
        }

        // artık kategori fetch etmeye gerek yok
        const coursesWithImage = parsedCourses.map((c) => ({
          ...c,
          imagePath: getDriveImageUrl(c.imagePath),
        }));

        console.log("Courses with images:", coursesWithImage);
        setCourses(coursesWithImage);
      } catch (error) {
        console.error("Veriler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoSelect = (videoId) => setSelectedVideo(videoId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      imagePath: formData.imagePath.trim(),
      videoIds: selectedVideo ? [selectedVideo] : [],
      targetAudience: formData.targetAudience
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      categoryId: formData.categoryId,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api.viviacademy.xyz/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kurs eklenemedi");

      alert("✅ Kurs başarıyla eklendi!");

      const newCourse = {
        ...data.data,
        imagePath: getDriveImageUrl(data.data.imagePath),
      };
      setCourses((prev) => [...prev, newCourse]);

      setFormData({
        title: "",
        shortDescription: "",
        description: "",
        price: "",
        imagePath: "",
        targetAudience: "",
        categoryId: "",
      });
      setSelectedVideo("");
    } catch (error) {
      console.error("POST Hatası:", error);
      alert("❌ Hata oluştu: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Bu kursu silmek istediğinize emin misiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://api.viviacademy.xyz/api/courses/${courseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Silme işlemi başarısız");
      }

      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("✅ Kurs başarıyla silindi!");
    } catch (error) {
      console.error("Silme Hatası:", error);
      alert("❌ Hata: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Yeni Kurs Ekle</h1>

      {loading ? (
        <p className="text-gray-500">Veriler yükleniyor...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="title"
              placeholder="Kurs Başlığı"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="shortDescription"
              placeholder="Kısa Açıklama"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <textarea
              name="description"
              placeholder="Açıklama"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="price"
              placeholder="Fiyat (örnek: 1.99)"
              value={formData.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              required
            />
            <input
              name="imagePath"
              placeholder="Resim URL"
              value={formData.imagePath}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="targetAudience"
              placeholder="Hedef Kitle (virgülle ayır)"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Kategori Seç</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="border rounded">
              <button
                type="button"
                onClick={() => setShowVideos(!showVideos)}
                className="w-full text-left px-3 py-2 bg-gray-100 font-semibold"
              >
                🎬 Videoları {showVideos ? "Gizle" : "Göster"}
              </button>
              {showVideos && (
                <div className="p-3 max-h-60 overflow-y-auto">
                  {videos.map((video) => (
                    <label
                      key={video.id}
                      className="flex items-center space-x-2 border-b py-1"
                    >
                      <input
                        type="radio"
                        name="videoSelect"
                        checked={selectedVideo === video.id}
                        onChange={() => handleVideoSelect(video.id)}
                        className="ml-2"
                      />
                      <span className="text-sm">{video.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`${
                submitting ? "bg-gray-400" : "bg-[#e80cbc] hover:bg-[#9e047f]"
              } text-white px-4 py-2 rounded w-full transition-colors`}
            >
              {submitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">📚 Mevcut Kurslar</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Resim</th>
                    <th className="border px-3 py-2 text-left">Başlık</th>
                    <th className="border px-3 py-2 text-left">Eğitmen</th>
                    <th className="border px-3 py-2 text-left">Fiyat</th>
                    <th className="border px-3 py-2 text-left">Video Sayısı</th>
                    <th className="border px-3 py-2 text-left">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">
                          <img
                            src={c.imagePath}
                            alt={c.title}
                            className="w-16 h-10 object-cover rounded"
                            onError={(e) => {
                              console.log("Image load error for:", c.imagePath);
                              e.target.src =
                                "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </td>
                        <td className="border px-3 py-2">{c.title}</td>
                        <td className="border px-3 py-2">{c.trainerName}</td>
                        <td className="border px-3 py-2">{c.price} ₺</td>
                        <td className="border px-3 py-2">
                          {c.videoIds?.length || 0}
                        </td>
                        <td className="border px-3 py-2">
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-3 text-gray-500"
                      >
                        Henüz kurs yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddCourses;
