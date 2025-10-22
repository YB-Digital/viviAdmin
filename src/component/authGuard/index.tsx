"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    // AdminId veya token yoksa login sayfasına yönlendir
    if (!adminId || !token) {
      if (window.location.pathname.startsWith("/admin")) {
        router.push("/login");
      }
    }
  }, [router]);

  return null;
};

export default AuthGuard;
