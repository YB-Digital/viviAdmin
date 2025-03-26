'use client';

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./courseTable.scss";
import ImageComponent from "../imageComponent";
import VideoComponent from "../videoComponent";

interface Video {
  video_order: number;
  video_path: string;
}

interface Course {
  id: string;
  course_name: string;
  description: string;
  price: string;
  image: string;
  videos: Video[];
  category_name: string;
}

interface CourseTableProps {
  courses: Course[];
  refreshCourses: () => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, refreshCourses }) => {
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFiles, setVideoFiles] = useState<Record<number, File | null>>({});

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/delete_course.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: courseId }),
      });

      const data = await response.json();

      if (data.status === "success") {
        refreshCourses();
      } else {
        setError("Failed to delete the course.");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("An error occurred while deleting the course.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;

    const formData = new FormData();
    formData.append("id", editingCourse.id);
    formData.append("course_name", editingCourse.course_name);
    formData.append("description", editingCourse.description);
    formData.append("price", editingCourse.price);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Add changed videos with their order
    Object.entries(videoFiles).forEach(([order, file]) => {
      if (file) {
        formData.append(`video_order[${order}]`, order);
        formData.append(`video_files[${order}]`, file);
      }
    });

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/update_course.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        refreshCourses();
        setEditingCourse(null);
        setVideoFiles({});
        setImageFile(null);
      } else {
        setError("Failed to update the course.");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setError("An error occurred while updating the course.");
    }
  };

  const handleVideoChange = (order: number, file: File | null) => {
    setVideoFiles((prev) => ({
      ...prev,
      [order]: file,
    }));
  };

  return (
    <div className="courseTable">
      {error && <div className="error">{error}</div>}

      <div className="titleRow">
        <div className="column no">No.</div>
        <div className="column image">Image</div>
        <div className="column courseName">Course Name</div>
        <div className="column description">Description</div>
        <div className="column price">Price</div>
        <div className="column category">Category</div>
        <div className="column videos">Videos</div>
        <div className="column actions">Actions</div>
      </div>

      {courses.map((course, index) => (
        <div key={course.id} className="courseRow">
          <div className="column no">{index + 1}</div>
          <div className="column image">
            <img src={`https://ybdigitalx.com${course.image}`} alt="Course Image" />
          </div>
          <div className="column courseName" title={course.course_name}>
            {truncateText(course.course_name, 15)}
          </div>
          <div className="column description" title={course.description}>
            {truncateText(course.description, 20)}
          </div>
          <div className="column price">${course.price}</div>
          <div className="column category">{course.category_name}</div>
          <div className="column videos">
            {course.videos.length > 0 ? (
              <ul>
                {course.videos.map((video, i) => (
                  <li key={i}>
                    <a href={`https://ybdigitalx.com${video.video_path}`} target="_blank" rel="noreferrer">
                      Video {video.video_order}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No videos</span>
            )}
          </div>
          <div className="column actions">
            <button className="editBtn" onClick={() => setEditingCourse(course)} title="Edit">
              <FaEdit />
            </button>
            <button className="deleteBtn" onClick={() => handleDelete(course.id)} title="Delete">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {editingCourse && (
        <div className="editModal">
          <div className="modalContent">
            <h3>Edit Course</h3>
            <label>Course Name:</label>
            <input
              type="text"
              value={editingCourse.course_name}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, course_name: e.target.value })
              }
            />
            <label>Description:</label>
            <textarea
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, description: e.target.value })
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
            <ImageComponent label="New Image" accept="image/*" onFileChange={setImageFile} />

            <div>
              <label>Current Video(s):</label>
              <ul>
                {editingCourse.videos.map((video, idx) => (
                  <li key={idx}>
                    <p>
                      <a
                        href={`https://ybdigitalx.com${video.video_path}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Video {video.video_order}
                      </a>
                    </p>
                    <VideoComponent
                      label={`Replace Video ${video.video_order}`}
                      accept="video/*"
                      onFileChange={(file) => handleVideoChange(video.video_order, file)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="modalActions">
              <button className="saveBtn" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="cancelBtn" onClick={() => {
                setEditingCourse(null);
                setVideoFiles({});
                setImageFile(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
