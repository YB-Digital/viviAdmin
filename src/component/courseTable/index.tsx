"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./courseTable.scss";
import ImageComponent from "../imageComponent";
import VideoComponent from "../videoComponent";
import Image from "next/image";

interface Video {
  video_order: number;
  video_path: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number | string; // ✅ her ikisini de kabul et
  imagePath: string;
  trainerName?: string; // ✅ optional yap
  videos?: Video[];
  categoryName?: string;
}

interface CourseTableProps {
  courses: Course[];
  refreshCourses: () => void;
}
// const CourseTable: React.FC<CourseTableProps> = ({
//   courses,
//   refreshCourses,
// })
const CourseTable: React.FC<CourseTableProps> = ({}) => {
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://api.viviacademy.xyz/api/courses/getall");
        if (!res.ok) throw new Error("Kurslar çekilemedi");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err: any) {
        setError(err.message || "Kurslar yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Kursları kategoriye göre gruplama
  const groupedCourses = courses.reduce<{ [key: string]: Course[] }>((acc, course) => {
    const category = course.categoryName || "Diğer";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // const handleSaveEdit = async () => {
  //   if (!editingCourse) return;

  //   const formData = new FormData();
  //   formData.append("id", editingCourse.id);
  //   formData.append("course_name", editingCourse.course_name);
  //   formData.append("description", editingCourse.description);
  //   formData.append("price", editingCourse.price);

  //   if (imageFile) {
  //     formData.append("image", imageFile);
  //   }

  //   Object.entries(videoFiles).forEach(([order, file]) => {
  //     if (file) {
  //       formData.append("video_order[]", order);
  //       formData.append("video_files[]", file);
  //     }
  //   });

  //   try {
  //     const response = await fetch(
  //       "https://ybdigitalx.com/vivi_backend/update_course.php",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.status === "success") {
  //       refreshCourses();
  //       setEditingCourse(null);
  //       setVideoFiles({});
  //       setImageFile(null);
  //     } else {
  //       setError(data.message || "Failed to update course.");
  //     }
  //   } catch (err) {
  //     console.error("Error updating course:", err);
  //     setError("An error occurred while updating the course.");
  //   }
  // };

  // const handleVideoChange = (order: number, file: File | null) => {
  //   setVideoFiles((prev) => ({
  //     ...prev,
  //     [order]: file,
  //   }));
  // };

  return (
    <div className="courseTable">
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && Object.entries(groupedCourses).map(([category, courses]) => (
        <div key={category} className="courseCategoryBlock">
          <h2 className="categoryTitle">{category}</h2>
          <div className="titleRow">
            <div className="column no">No.</div>
            <div className="column image">Image</div>
            <div className="column courseName">Course Name</div>
            <div className="column description">Description</div>
            <div className="column price">Price</div>
            <div className="column actions">Actions</div>
          </div>
          {courses.map((course, index) => (
            <div key={course.id} className="courseRow">
              <div className="column no">{index + 1}</div>
              <div className="column image">
                <Image src={course.imagePath} alt="image" width={100} height={60} />
              </div>
              <div className="column courseName">{truncateText(course.title, 15)}</div>
              <div className="column description" title={course.description}>{truncateText(course.description, 20)}</div>
              <div className="column price">€{course.price}</div>
              <div className="column actions">
                <button className="deleteBtn" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* {editingCourse && (
        <div className="editModal">
          <div className="modalContent">
            <h3>Edit Course</h3>
            <label>Course Name:</label>
            <input
              type="text"
              value={editingCourse.course_name}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  course_name: e.target.value,
                })
              }
            />
            <label>Description:</label>
            <textarea
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  description: e.target.value,
                })
              }
            />
            <label>Price:</label>
            <input
              type="text"
              value={editingCourse.price}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, price: e.target.value })
              }
            />

            <div>
              <label>Current Image:</label>
              <span>{editingCourse.image}</span>
            </div>
            <ImageComponent
              label="New Image"
              accept="image/*"
              onFileChange={setImageFile}
            />

            <div>
              <label>Video(s):</label>
              <ul>
                {[...Array(videoSlotCount)].map((_, index) => {
                  const order = index + 1;
                  const existingVideo = editingCourse.videos.find(
                    (v) => v.video_order === order
                  );
                  return (
                    <li key={order}>
                      {existingVideo ? (
                        <p>
                          <a
                            href={`https://ybdigitalx.com${existingVideo.video_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Video {order} –{" "}
                            {existingVideo.video_path.split("/").pop()}
                          </a>
                        </p>
                      ) : (
                        <p>No Video {order}</p>
                      )}
                      <VideoComponent
                        label={
                          existingVideo
                            ? `Replace Video ${order}`
                            : `Upload Video ${order}`
                        }
                        accept="video/*"
                        onFileChange={(file) => handleVideoChange(order, file)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="modalActions">
              <button className="saveBtn" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="cancelBtn"
                onClick={() => {
                  setEditingCourse(null);
                  setVideoFiles({});
                  setImageFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CourseTable;
