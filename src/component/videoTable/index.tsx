"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import "./videoTable.scss";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  filePath: string;
  thumbnailUrl: string;
  uploaderId: string;
  uploadedAt: any;
  categoryId: string;
  videoSections: string[];
}

interface Category {
  id: string;
  name: string;
}

const VideoTable = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token yok");

      const res = await fetch("https://api.viviacademy.xyz/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Videolar çekilemedi");

      const data = await res.json();
      setVideos(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Videolar yüklenirken hata oluştu");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token yok");

      const res = await fetch(
        "https://api.viviacademy.xyz/api/categories/getall",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Kategoriler çekilemedi");

      const data = await res.json();
      const catArray = (Array.isArray(data) ? data : [])
        .filter((item: any) => item.success && item.data)
        .map((item: any) => ({ id: item.data.id, name: item.data.name }));
      setCategories(catArray);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Kategoriler yüklenirken hata oluştu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token yok");

      const res = await fetch(`https://api.viviacademy.xyz/api/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");

      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Silme sırasında hata oluştu");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchVideos();
  }, []);

  return (
    <div className="videoTable">
      {error && <div className="error">{error}</div>}

      <div className="titleRow">
        <div className="column no">No.</div>
        <div className="column thumbnail">Thumbnail</div>
        <div className="column title">Title</div>
        <div className="column description">Description</div>
        <div className="column category">Category</div>
        <div className="column sections">Video Sections</div>
        <div className="column actions">Actions</div>
      </div>

      {videos.map((video, index) => {
        const category =
          categories.find((c) => c.id === video.categoryId)?.name || "Unknown";
        // Validate thumbnailUrl
        let thumbnailSrc = "/placeholder.png";
        if (video.thumbnailUrl) {
          try {
            const url = new URL(video.thumbnailUrl, window.location.origin);
            // Only allow http/https URLs or relative paths
            if (
              url.protocol === "http:" ||
              url.protocol === "https:" ||
              url.origin === window.location.origin
            ) {
              thumbnailSrc = video.thumbnailUrl;
            }
          } catch (e) {
            // Invalid URL, use placeholder
          }
        }
        return (
          <div key={video.id} className="videoRow">
            <div className="column no">{index + 1}</div>
            <div className="column thumbnail">
              <Image
                src={thumbnailSrc}
                width={100}
                height={60}
                alt="thumbnail"
              />
            </div>
            <div className="column title">{video.title}</div>
            <div className="column description" title={video.description}>
              {video.description.length > 30
                ? video.description.substring(0, 30) + "..."
                : video.description}
            </div>
            <div className="column category">{category}</div>
            <div className="column sections">
              {video.videoSections && video.videoSections.length > 0
                ? video.videoSections.join(", ")
                : "-"}
            </div>

            <div className="column actions">
              <button
                className="deleteBtn"
                onClick={() => handleDelete(video.id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoTable;
