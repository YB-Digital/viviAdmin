"use client";

import { useEffect, useState } from "react";
import "./dashboardUserTable.scss";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  city: string;
}

export default function DashboardUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://api.viviacademy.xyz/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log("Raw API Data:", rawData);

        const usersArray: User[] = rawData.map((item: any) => ({
          id: item.data.id,
          name: item.data.fullName,
          email: item.data.email,
          username: item.data.username,
          city: item.data.city || "-",
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    setDeleting(userId);

    try {
      const response = await fetch(
        `https://api.viviacademy.xyz/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Silme işlemi başarısız");
      }

      // Kullanıcıyı listeden kaldır
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert("✅ Kullanıcı başarıyla silindi!");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("❌ Hata: " + (error as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  if (!isClient) return null;

  return (
    <div className="dashboardUserTable">
      <div className="title">
        <div className="userId font-inter">ID</div>
        <div className="userName font-inter">Name</div>
        <div className="userEmail font-inter">Email</div>
        <div className="userMessage font-inter">City</div>
        <div className="userCheck font-inter">Action</div>
      </div>

      {loading ? (
        <p className="loading font-inter">Loading...</p>
      ) : users.length > 0 ? (
        users.map((user, index) => (
          <div key={user.id} className="userRow">
            <div className="userId font-inter">{index + 1}</div>
            <div className="userName font-inter">{user.name}</div>
            <div className="userEmail font-inter">{user.email}</div>
            <div className="userMessage font-inter">{user.city}</div>
            <div className="userCheck font-inter">
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deleting === user.id}
                className="deleteButton"
                style={{
                  backgroundColor: deleting === user.id ? "#ccc" : "#e80cbc",
                  color: "white",
                  padding: "5px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: deleting === user.id ? "not-allowed" : "pointer",
                }}
              >
                {deleting === user.id ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="noUsers font-inter">No users found.</p>
      )}
    </div>
  );
}
