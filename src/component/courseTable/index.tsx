"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import FileComponent from "@/component/fileComponent"; // Dosya yükleme bileşeni
import "./courseTable.scss";

interface Course {
    id: string;
    course_name: string;
    description: string;
    price: string;
    image: string;
    videos: string;
}

interface CourseTableProps {
    onEdit: (course: Course) => void;
    courses: Course[];
    refreshCourses: () => void;
}

// Metni belirli bir karakter uzunluğuna göre kesen yardımcı fonksiyon
const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function CourseTable({ onEdit, courses, refreshCourses }: CourseTableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    useEffect(() => {
        setLoading(false);
    }, [courses]);

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
        } catch (error) {
            console.error("Error deleting course:", error);
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

        if (videoFile) {
            formData.append("videos", videoFile);
        }

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/update_course.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.status === "success") {
                refreshCourses();
                setEditingCourse(null); // Modalı kapat
            } else {
                setError("Failed to update the course.");
            }
        } catch (error) {
            console.error("Error updating course:", error);
            setError("An error occurred while updating the course.");
        }
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
                <div className="column actions">Actions</div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : courses.length > 0 ? (
                courses.map((course, index) => (
                    <div key={course.id} className="courseRow">
                        <div className="column no">{index + 1}</div>
                        <div className="column image">
                            <img 
                                src={course.image && !course.image.includes("default-image.png") 
                                    ? `https://ybdigitalx.com/vivi_Adminbackend${course.image}` 
                                    : "/default-image.png"
                                }
                                alt="Course Image"
                                onError={(e) => {
                                    if (e.currentTarget.src !== window.location.origin + "/default-image.png") {
                                        e.currentTarget.src = "/default-image.png";
                                    }
                                }}
                            />
                        </div>
                        <div className="column courseName" title={course.course_name}>
                            {truncateText(course.course_name, 10)}
                        </div>
                        <div className="column description" title={course.description}>
                            {truncateText(course.description, 20)}
                        </div>
                        <div className="column price">${course.price}</div>
                        <div className="column actions">
                            <button className="editBtn" onClick={() => setEditingCourse(course)} title="Edit">
                                <FaEdit />
                            </button>
                            <button className="deleteBtn" onClick={() => handleDelete(course.id)} title="Delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="noData">No courses found.</div>
            )}

            {/* Edit Modal */}
            {editingCourse && (
                <div className="editModal">
                    <div className="modalContent">
                        <h3>Edit Course</h3>
                        <label>Course Name:</label>
                        <input
                            type="text"
                            value={editingCourse.course_name}
                            onChange={(e) => setEditingCourse({ ...editingCourse, course_name: e.target.value })}
                        />
                        <label>Description:</label>
                        <textarea
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                        />
                        <label>Price:</label>
                        <input
                            type="text"
                            value={editingCourse.price}
                            onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                        />

                        <div className="fileUpload">
                            <label>Current Image:</label>
                            <div className="currentMedia">
                                <img 
                                    src={editingCourse.image && !editingCourse.image.includes("default-image.png") 
                                        ? `https://ybdigitalx.com/vivi_Adminbackend${editingCourse.image}` 
                                        : "/default-image.png"
                                    }
                                    alt="Course Image"
                                    onError={(e) => {
                                        if (e.currentTarget.src !== window.location.origin + "/default-image.png") {
                                            e.currentTarget.src = "/default-image.png";
                                        }
                                    }}
                                />
                            </div>
                            <FileComponent label="New Image" accept="image/*" onFileChange={setImageFile} />
                        </div>

                        <div className="fileUpload">
                            <label>Current Video:</label>
                            <div className="currentMedia">
                                <video controls>
                                    <source src={`https://ybdigitalx.com/vivi_Adminbackend${editingCourse.videos}`} type="video/mp4" />
                                </video>
                            </div>
                            <FileComponent label="New Video" accept="video/*" onFileChange={setVideoFile} />
                        </div>

                        <div className="modalActions">
                            <button className="saveBtn" onClick={handleSaveEdit}>Save</button>
                            <button className="cancelBtn" onClick={() => setEditingCourse(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
