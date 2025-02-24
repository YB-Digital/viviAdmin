"use client";

import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

//style
import "./sendCertificateTable.scss";

interface User {
  user_id: number;
  fullname: string;
  email: string;
  course_name: string;
  course_id: string;
}

interface SendCertificateTableProps {
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      course_id: string;
      user_id: string;
      certificateFile: File | null;
    }>
  >;
}

export default function SendCertificateTable({ setFormData }: SendCertificateTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://viviacademy.de/vivi_Adminbackend/certificate_table.php");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(
            data.map((user: any) => ({
              user_id: Number(user.user_id),
              fullname: `${user.first_name} ${user.last_name}`,
              email: user.email,
              course_name: user.course_name,
              course_id: user.course_id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    setFormData({
      email: user.email,
      user_id: String(user.user_id),
      course_id: String(user.course_id),
      certificateFile: null,
    });
  };

  return (
    <div className="sendCertificateTable">
      <div className="tableContainer">
        <div className="titleRow">
          <div className="column index">No.</div>
          <div className="column name">Full Name</div>
          <div className="column email">Email Address</div>
          <div className="column course">Completed Training</div>
          <div className="column action">Actions</div>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : users.length > 0 ? (
          users.map((user, index) => (
            <div key={user.user_id} className="dataRow">
              <div className="column index">{index + 1}</div>
              <div className="column name">{user.fullname}</div>
              <div className="column email">{user.email}</div>
              <div className="column course">{user.course_name}</div>
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
