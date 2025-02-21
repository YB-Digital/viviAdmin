"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./courseTable.scss";

interface Course {
    id: string;
    course_name: string;
    description: string;
    price: string;
    image: string;
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
                            <img src={`https://ybdigitalx.com/vivi_Adminbackend${course.image}`} alt={course.course_name} loading="lazy" />
                        </div>
                        <div className="column courseName" title={course.course_name}>
                            {truncateText(course.course_name, 10)}
                        </div>
                        <div className="column description" title={course.description}>
                            {truncateText(course.description, 20)}
                        </div>
                        <div className="column price">${course.price}</div>
                        <div className="column actions">
                            <button className="editBtn" onClick={() => onEdit(course)} title="Edit">
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
        </div>
    );
}
