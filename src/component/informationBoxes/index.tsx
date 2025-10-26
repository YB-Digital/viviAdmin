"use client";

import { useEffect, useState } from "react";
import InformationBoxe from "../informationBoxe";
import "./informationBoxes.scss";

//image
import revenue from "@/image/revenue.svg";
import user from "@/image/adminUser.svg";
import service from "@/image/adminServices.svg";
import video from "@/image/adminVideo.svg";
import { METHODS } from "http";

export default function InformationBoxes() {
  const [stats, setStats] = useState({
    total_revenue: "0",
    total_users: "0",
    total_services: "0",
    total_video: "0",
  });

  const [isClient, setIsClient] = useState<boolean>(false); // ✅ Prevents SSR errors.

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      // Toplam Gelir
      // fetch("https://ybdigitalx.com/vivi_backend/total_revenue.php")
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setStats((prev) => ({
      //       ...prev,
      //       total_revenue: data.total_revenue || "0",
      //     }));
      //   })
      //   .catch((err) => console.error("Gelir verisi alınamadı:", err));

      // Toplam Kullanıcı
      fetch("https://api.viviacademy.xyz/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const totalUsers = Array.isArray(data) ? data.length : 0;
          // console.log("totalUser:", totalUsers);
          setStats((prev) => ({
            ...prev,
            total_users: totalUsers.toString(),
          }));
        })
        .catch((err) => console.error("Kullanıcı verisi alınamadı:", err));

      // Toplam Servis
      // fetch("https://ybdigitalx.com/vivi_backend/total_services.php")
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setStats((prev) => ({
      //       ...prev,
      //       total_services: data.total_services || "0",
      //     }));
      //   })
      //   .catch((err) => console.error("Servis verisi alınamadı:", err));

      // Toplam Video
      fetch("https://api.viviacademy.xyz/api/videos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("data:", data);

          // data.data dizisini kontrol ediyoruz
          const total_video = Array.isArray(data.data) ? data.data.length : 0;

          // console.log("totalvideo :", total_video);

          setStats((prev) => ({
            ...prev,
            total_video: total_video.toString(),
          }));
        })
        .catch((err) => console.error("Video verisi alınamadı:", err));
    }
  }, []);

  // ✅ Prevents rendering on the server
  if (!isClient) return null;

  return (
    <div className="informationBoxes">
      <InformationBoxe
        img={revenue}
        text={"Total Sell"}
        data={`${stats.total_revenue}`}
        className={"revenue"}
      />
      <InformationBoxe
        img={user}
        text={"User"}
        data={stats.total_users}
        className={"user"}
      />
      <InformationBoxe
        img={service}
        text={"Total Service"}
        data={stats.total_services}
        className={"service"}
      />
      <InformationBoxe
        img={video}
        text={"Total Video"}
        data={stats.total_video}
        className={"video"}
      />
    </div>
  );
}
