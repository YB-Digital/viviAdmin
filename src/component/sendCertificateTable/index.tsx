"use client";

import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./sendCertificateTable.scss";

interface User {
  id: number;
  name: string;
  email: string;
  training: string;
}

interface SendCertificateTableProps {
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; course_id: string; user_id: string; certificateFile: File | null }>>;
}

export default function SendCertificateTable({ setFormData }: SendCertificateTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://ybdigitalx.com/vivi_Adminbackend/dashboard_table.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.contacts) && data.contacts.length > 0) {
          setUsers(
            data.contacts.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              training: user.message,
            }))
          );
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleUserSelect = (user: User) => {
    setFormData((prev) => ({ ...prev, email: user.email, user_id: String(user.id) }));
  };

  return (
    <div className="sendCertificateTable">
      <div className="tableContainer">
        <div className="titleRow">
          <div className="column title">No.</div>
          <div className="column title">Name Surname</div>
          <div className="column title">Email Address</div>
          <div className="column title">Completed Training</div>
          <div className="column title">Actions</div>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="dataRow">
              <div className="column">{user.id}</div>
              <div className="column">{user.name}</div>
              <div className="column">{user.email}</div>
              <div className="column">{user.training}</div>
              <div className="column action">
                <FaEdit className="editIcon" onClick={() => handleUserSelect(user)} />
              </div>
            </div>
          ))
        ) : (
          <p className="noUsers">No users found.</p>
        )}
      </div>
    </div>
  );
}