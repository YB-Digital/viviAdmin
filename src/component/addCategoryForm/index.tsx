"use client";

import { useState } from "react";

//style
import "./addCategoryFrom.scss";

export default function AddCategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        "https://viviacademy.de/vivi_Adminbackend/category_registration.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName }),
        }
      );

      const contentType = response.headers.get("content-type");

      // Yanıtın JSON formatında olup olmadığını kontrol et
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format. Expected JSON.");
      }

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage("✅ Category added successfully!");
        setCategoryName("");
      } else {
        setMessage(` Error: ${data.message || "Unknown error occurred."}`);
      }
    } catch (error: any) {
      console.error("Category submission failed:", error);
      setMessage(`Submission error: ${error.message}`);
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