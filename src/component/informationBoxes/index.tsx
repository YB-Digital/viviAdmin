"use client";

import React, { useEffect, useState } from "react";
import InformationBoxe from "../informationBoxe";

//style
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

  useEffect(() => {
    fetch("https://viviacademy.de/vivi_Adminbackend/dashboard_box.php")
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
  }, []);

  return (
    <div className="informationBoxes">
      <InformationBoxe img={revenue} text={"Total Revenue"} data={`$ ${stats.total_revenue}`} class={"revenue"} />
      <InformationBoxe img={user} text={"User"} data={stats.total_users} class={"user"} />
      <InformationBoxe img={service} text={"Total Service"} data={stats.total_services} class={"service"} />
      <InformationBoxe img={video} text={"Total Video"} data={stats.total_video} class={"video"} />
    </div>
  );
}