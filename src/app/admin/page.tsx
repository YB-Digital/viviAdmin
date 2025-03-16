"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/component/inputComponent";

//style
import "./profile.scss";

export default function Page() {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [adminId, setAdminId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // ✅ Prevent SSR issues

  useEffect(() => {
    // ✅ Ensure code runs ONLY in the browser
    if (typeof window !== "undefined") {
      setIsClient(true);

      const storedAdminId = localStorage.getItem("adminId");
      if (storedAdminId) {
        setAdminId(storedAdminId);
        fetchProfileData(storedAdminId);
      } else {
        setError("Unauthorized access. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    }
  }, []);

  const fetchProfileData = async (adminId: string) => {
    if (!adminId) return; // Prevent running if no adminId

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setFormData({
          fullName: data.data.fullName || "",
          email: data.data.email || "",
        });
      } else {
        setError(data.message || "Failed to load profile.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adminId) {
      setError("Unauthorized action.");
      return;
    }

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/profile_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: adminId,
          fullName: formData.fullName,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setIsEditable(false);
        setSuccess("Profile updated successfully!");
        fetchProfileData(adminId);
      } else {
        setError(data.message || "Error updating profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Network error. Please try again later.");
    }
  };

  const toggleEdit = () => {
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
      setSuccess(null);
    }
  };

  // ✅ Prevent rendering on the server to avoid `localStorage` issues.
  if (!isClient) return null; // Ensures no SSR issue

  return (
    <div className="profilePage">
      <h3 className="font-montserrat">My Profile</h3>

      {loading ? (
        <p className="loadingMessage">Loading profile...</p>
      ) : error ? (
        <p className="errorMessage">{error}</p>
      ) : (
        <form>
          <div className="information">
            <h4 className="font-inter">Profile Information</h4>
            <p className="font-inter editButton" onClick={toggleEdit}>
              {isEditable ? "Save" : "Edit"}
            </p>
          </div>

          <div className="formGroup">
            <label htmlFor="name" className="font-inter">
              Full Name:
            </label>
            <InputComponent
              name="fullName"
              value={formData.fullName}
              placeholder="Enter your full name"
              disabled={!isEditable}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email" className="font-inter">
              Email:
            </label>
            <InputComponent
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              disabled={!isEditable}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {success && <p className="successMessage">{success}</p>}
        </form>
      )}
    </div>
  );
}
