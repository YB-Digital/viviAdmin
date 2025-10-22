"use client";

import Image from "next/image";

//style
import "./header.scss";

//image
import logo from "@/image/logo.svg";
import user from "@/image/user.svg";
import logout from "@/image/logOut.svg";
import Link from "next/link";

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    window.location.reload();
  };

  return (
    <header>
      <div className="container">
        <Image src={logo} alt="" />
        <div className="icons">
          <Link href={"/admin"}>
            <Image src={user} alt="user icon" />
          </Link>
          <Image
            src={logout}
            alt="logout icon"
            onClick={handleLogout}
            className="logoutIcon"
          />
        </div>
      </div>
    </header>
  );
}
