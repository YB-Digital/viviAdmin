"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Stil dosyası
import "./categoryTable.scss";

interface Category {
  id: number;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TEST için statik veriler ekliyoruz
    setTimeout(() => {
      setCategories([
        { id: 1, name: "Skincare & Aesthetics" },
        { id: 2, name: "Makeup & Beauty" },
        { id: 3, name: "Haircare & Styling" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  return (
    <div className="categoryList">
      {/* Başlık Satırı */}
      <div className="titleRow">
        <div className="column no">No.</div>
        <div className="column categoryName">Category Name</div>
        <div className="column actions">Actions</div>
      </div>

      {/* Kategori Listesi */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : categories.length > 0 ? (
        categories.map((category, index) => (
          <div key={category.id} className="categoryRow">
            <div className="column no">{index + 1}</div>
            <div className="column categoryName">{category.name}</div>
            <div className="column actions">
              <button className="editBtn">
                <FaEdit />
              </button>
              <button className="deleteBtn" onClick={() => handleDelete(category.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="noData">No categories found.</div>
      )}
    </div>
  );
}
