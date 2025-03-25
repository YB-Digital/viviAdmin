"use client";

import { useEffect, useState } from "react";
import "./dashboardUserTable.scss";

interface User {
  id: number;
  name: string;
  email: string;
  message: string;
  check: boolean;
}

export default function DashboardUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      try {
        const storedAdminId = localStorage.getItem("adminId") || null;
        if (storedAdminId) {
          setAdminId(storedAdminId);
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }

    fetch("https://ybdigitalx.com/vivi_backend/dashboard_table.php")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.status === "success" && Array.isArray(data.contacts)) {
          setUsers(
            data.contacts.map((user: { id: number; name: string; email: string; message: string; check: string }) => ({
              ...user,
              check: user.check === "✔" || user.check === "1",
            }))
          );
        } else {
          console.error("Invalid API response format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCheckUpdate = async (userId: number, newCheckStatus: boolean) => {
    try {
      console.log("Updating check for User ID:", userId);
      const response = await fetch("https://ybdigitalx.com/vivi_backend/update_check_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          check: newCheckStatus ? "1" : "0",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, check: newCheckStatus } : user
          )
        );
      } else {
        console.error("Failed to update check status:", data.message);
      }
    } catch (error) {
      console.error("Error updating check status:", error);
    }
  };

  if (!isClient) return null;

  return (
    <div className="dashboardUserTable">
      <div className="title">
        <div className="userId">ID</div>
        <div className="userName">Name</div>
        <div className="userEmail">Email</div>
        <div className="userMessage">Message</div>
        <div className="userCheck">Check</div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="userRow">
            <div className="userId">{user.id}</div>
            <div className="userName">{user.name}</div>
            <div className="userEmail">{user.email}</div>
            <div className="userMessage">{user.message}</div>
            <div
              className={`userCheck ${user.check ? "checked" : "unchecked"}`}
              onClick={() => handleCheckUpdate(user.id, !user.check)}
            >
              {user.check ? "✔" : "✖"}
            </div>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}