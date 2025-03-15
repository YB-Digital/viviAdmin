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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdminId = localStorage.getItem("adminId") || null;
      setAdminId(storedAdminId);
      console.log(adminId)
    }

    fetch("https://ybdigitalx.com/vivi_backend/dashboard_table.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.contacts)) {
          setUsers(
            data.contacts.map((user: { id: number; name: string; email: string; message: string; check: string }) => ({
              ...user,
              check: user.check === "✔" || user.check === "1", // Convert check to boolean
            }))
          );
        } else {
          console.error("No data or incorrect data format received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboardUserTable">
      <div className="title">
        <div className="userId font-inter">ID</div>
        <div className="userName font-inter">Name</div>
        <div className="userEmail font-inter">Email</div>
        <div className="userMessage font-inter">Message</div>
        <div className="userCheck font-inter">Check</div>
      </div>

      {loading ? (
        <p className="loading font-inter">Loading...</p>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="userRow">
            <div className="userId font-inter">{user.id}</div>
            <div className="userName font-inter">{user.name}</div>
            <div className="userEmail font-inter">{user.email}</div>
            <div className="userMessage font-inter">{user.message}</div>
            <div className={`userCheck font-inter ${user.check ? "checked" : "unchecked"}`}>
              {user.check ? "✔" : "✖"}
            </div>
          </div>
        ))
      ) : (
        <p className="noUsers font-inter">No users found.</p>
      )}
    </div>
  );
}
