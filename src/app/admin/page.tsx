"use client";

import { useState, useEffect } from "react";
import InputComponent from "@/component/inputComponent";
import "./profile.scss";

export default function Page() {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Sayfa açıldığında kullanıcıyı çek
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("https://api.viviacademy.xyz/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log("result:", result);

      // Her elemandan data al
      const userList = result.map((item: any) => item.data);
      console.log(
        "API emails:",
        userList.map((u) => u.email)
      );

      const email = localStorage.getItem("email")?.trim().toLowerCase();
      const foundUser = userList.find(
        (user: any) => user.email?.trim().toLowerCase() === email
      );
      console.log("FounderUser:", foundUser);

      if (foundUser) {
        setFormData({
          fullName: foundUser.fullName || "",
          email: foundUser.email || "",
        });
        setError(null);
      } else {
        setError("Kullanıcı bulunamadı.");
      }
    } catch (err) {
      console.error(err);
      setError("Ağ hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://ybdigitalx.com/vivi_backend/profile_update.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setIsEditable(false);
        setSuccess("Profile updated successfully!");
        fetchProfileData(); // güncel veriyi tekrar çek
      } else {
        setError(data.message || "Error updating profile.");
      }
    } catch (err) {
      console.error(err);
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

  if (!isClient) return null; // SSR sorunlarını önler

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
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {success && <p className="successMessage">{success}</p>}
        </form>
      )}
    </div>
  );
}
