"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboardUserTable.scss";

interface User {
  id: number;
  name: string;
  email: string;
  message: string;
  check: boolean; // `true` ise bakıldı, `false` ise bakılmadı
}

export default function DashboardUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost/viviAdmin/vivi_backend/dashboard_table.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.contacts) && data.contacts.length > 0) {
          setUsers(data.contacts.map((user: any) => ({ ...user, check: user.check === "✔" })));
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const toggleCheck = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, check: !user.check } : user
      )
    );

    fetch("http://localhost/viviAdmin/vivi_backend/update_check_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, check: true }),
    }).catch((error) => console.error("Error updating check status:", error));
  };

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
            <div
              className={`userCheck font-inter ${user.check ? "checked" : "unchecked"}`}
              onClick={() => toggleCheck(user.id)}
            >
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