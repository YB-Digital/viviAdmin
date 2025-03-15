"use client";

import { useState, useEffect } from "react";
import "./addCategoryForm.scss";

export default function AddCategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Ensure `localStorage` is accessed only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        "https://ybdigitalx.com/vivi_backend/category_registration.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName, userId }), // ✅ Send `userId` if available
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage("✅ Category added successfully!");
        setCategoryName("");
      } else {
        setMessage(`Error: ${data.message || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("Category submission failed:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addCategoryForm">
      <h2 className="formTitle">ADD CATEGORY</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="categoryName">Category name</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="saveButton" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
