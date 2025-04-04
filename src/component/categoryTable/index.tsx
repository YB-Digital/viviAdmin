"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./categoryTable.scss";

interface Category {
  id: number;
  name: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ Prevent SSR issues

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true); // ✅ Prevents  SSR issues
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/category_table.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      alert("Failed to fetch categories.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/category_delete.php", {
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
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/category_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCategory.id, name: editingCategory.name }),
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
      console.error("Update error:", error);
    }
  };

  // ✅ Prevents rendering on the server
  if (!isClient) return <p>Loading...</p>;

  return (
    <div className="categoryList">
      <div className="titleRow">
        <div className="column no">No.</div>
        <div className="column categoryName">Category Name</div>
        <div className="column actions">Actions</div>
      </div>

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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
};

export default CategoryList;
