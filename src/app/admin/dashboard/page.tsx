"use client";

import { useEffect, useState } from "react";
import InformationBoxes from "@/component/informationBoxes";
import DashboardUserTable from "@/component/dashboardUserTable";
import "./dashboard.scss";

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent rendering until client-side

  return (
    <div className="dashboardPage">
      <InformationBoxes />
      <DashboardUserTable />
    </div>
  );
}
