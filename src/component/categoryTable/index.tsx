"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./categoryTable.scss";

interface Category {
  id: string;
  name: string;
  description?: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      // console.log("📡 Token:", token);

      const response = await fetch(
        "https://api.viviacademy.xyz/api/categories/getall",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ⚠️ Bu satırda backend’in ne döndürdüğünü aynen yazdırıyoruz
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 🧭 metni tekrar JSON'a çeviriyoruz
      const result = JSON.parse(text);

      let categoriesData: any[] = [];

      if (Array.isArray(result)) {
        categoriesData = result.map((item: any) => item.data);
      } else if (result.data && Array.isArray(result.data)) {
        categoriesData = result.data;
      } else {
        console.warn("⚠️ Beklenen formatta veri dönmedi:", result);
      }

      setCategories(categoriesData);
    } catch (error) {
      alert("Failed to fetch categories.");
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      // console.log("🧭 Delete response:", data);

      if (response.ok && (data.success || data.status === "success")) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        alert(`Error: ${data.message || "Failed to delete."}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the category.");
      console.error("❌ Delete error:", error);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(
        `/api/admin/category/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingCategory.name,
            description: editingCategory.description || "",
          }),
        }
      );

      const data = await response.json();
      // console.log("🧭 Update response:", data);

      if (response.ok && (data.success || data.status === "success")) {
        // 🔄 Listedeki ilgili kategoriyi güncelle
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? editingCategory : cat
          )
        );
        setEditingCategory(null);
      } else {
        alert(`Error: ${data.message || "Failed to update category."}`);
      }
    } catch (error) {
      alert("An error occurred while updating the category.");
      console.error("❌ Update error:", error);
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
              <button
                className="editBtn"
                onClick={() => handleEditClick(category)}
              >
                <FaEdit />
              </button>
              <button
                className="deleteBtn"
                onClick={() => handleDelete(category.id)}
              >
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
