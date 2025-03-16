"use client";

import { useEffect, useState } from "react";
import InformationBoxe from "../informationBoxe";
import "./informationBoxes.scss";

//image
import revenue from "@/image/revenue.svg";
import user from "@/image/adminUser.svg";
import service from "@/image/adminServices.svg";
import video from "@/image/adminVideo.svg";

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
      fetch("https://ybdigitalx.com/vivi_backend/dashboard_box.php")
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setStats({
              total_revenue: data.total_revenue || "0",
              total_users: data.total_users || "0",
              total_services: data.total_services || "0",
              total_video: data.total_video || "0",
            });
          }
        })
        .catch((error) => console.error("Error fetching dashboard data:", error));
    }
  }, []);

  // ✅ Prevents rendering on the server
  if (!isClient) return null;

  return (
    <div className="informationBoxes">
      <InformationBoxe img={revenue} text={"Total Revenue"} data={`$ ${stats.total_revenue}`} className={"revenue"} />
      <InformationBoxe img={user} text={"User"} data={stats.total_users} className={"user"} />
      <InformationBoxe img={service} text={"Total Service"} data={stats.total_services} className={"service"} />
      <InformationBoxe img={video} text={"Total Video"} data={stats.total_video} className={"video"} />
    </div>
  );
}