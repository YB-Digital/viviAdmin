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

  const token = localStorage.getItem("token");

  // Component client-side olduğunda çalışacak
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const storedAdminId = localStorage.getItem("adminId") || null;
      setAdminId(storedAdminId);
    }
  }, []);

  // adminId değiştiğinde kullanıcıları çek
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
        // console.log("Raw API Data:", rawData);

        // API yanıtındaki data objesini parse et
        const usersArray: User[] = rawData.map((item: any, index: number) => ({
          id: index + 1,
          name: item.data.fullName,
          email: item.data.email,
          message: item.data.city || item.data.username, // istediğin alan
          check: false, // default
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [adminId]);

  // Check durumunu toggle et ve backend’e gönder
  const handleCheckUpdate = async (userId: number, newCheckStatus: boolean) => {
    // try {
    //   const response = await fetch(
    //     "https://ybdigitalx.com/vivi_backend/update_check_status.php",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         id: userId,
    //         check: newCheckStatus ? "1" : "0",
    //       }),
    //     }
    //   );
    //   const data = await response.json();
    //   if (data.status === "success") {
    //     setUsers((prevUsers) =>
    //       prevUsers.map((user) =>
    //         user.id === userId ? { ...user, check: newCheckStatus } : user
    //       )
    //     );
    //   } else {
    //     console.error("Check durumu güncellenemedi:", data.message);
    //   }
    // } catch (error) {
    //   console.error("Check durumu güncelleme hatası:", error);
    // }
  };

  // Sunucu tarafında render olmasın
  if (!isClient) return null;

  return (
    <div className="dashboardUserTable">
      <div className="title">
        <div className="userId font-inter">ID</div>
        <div className="userName font-inter">Name</div>
        <div className="userEmail font-inter">Email</div>
        <div className="userMessage font-inter">City</div>
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
              className={`userCheck font-inter ${
                user.check ? "checked" : "unchecked"
              }`}
              onClick={() => handleCheckUpdate(user.id, !user.check)}
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
