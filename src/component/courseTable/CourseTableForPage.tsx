"use client";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number | string;
  imagePath: string;
  videoIds?: string[];
  targetAudience?: string[];
  categoryName?: string;
}

export default function CourseTableForPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api.viviacademy.xyz/api/courses/getall", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        const courseArray = (Array.isArray(result.data) ? result.data : []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          shortDescription: item.shortDescription,
          price: item.price || 0,
          imagePath: item.imagePath || item.thumbnailUrl || "",
          videoIds: item.videoIds || [],
          targetAudience: item.targetAudience || [],
          categoryName: item.category?.name || "Unknown",
        }));
        setCourses(courseArray);
      } catch (err: any) {
        setError("Kurslar yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Kurslar yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="courseTableForPage">
      <h3>Kurslar</h3>
      <table>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Kısa Açıklama</th>
            <th>Açıklama</th>
            <th>Fiyat</th>
            <th>Kategori</th>
            <th>Videolar</th>
            <th>Hedef Kitle</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.shortDescription}</td>
              <td>{course.description}</td>
              <td>{course.price}</td>
              <td>{course.categoryName}</td>
              <td>{(course.videoIds || []).join(", ")}</td>
              <td>{(course.targetAudience || []).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
