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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Kategorileri API'den çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/category_table.php");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        alert("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Kategori Silme
  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/category_delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the category.");
    }
  };

  // Edit Modunu Açma
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  // Kategori Güncelleme
  const handleSaveEdit = async () => {
    if (!editingCategory || !editingCategory.id) return;

    let payload = { id: editingCategory.id, name: editingCategory.name };

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/category_registration.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "success") {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
        );
        setEditingCategory(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while updating the category.");
    }
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
              <button className="editBtn" onClick={() => handleEditClick(category)}>
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

      {/* Edit Modal */}
      {editingCategory && (
        <div className="editModal">
          <div className="modalContent">
            <h3>Edit Category</h3>
            <label>ID:</label>
            <input type="text" value={editingCategory.id} disabled />
            <label>Name:</label>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
            />
            <div className="modalActions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
