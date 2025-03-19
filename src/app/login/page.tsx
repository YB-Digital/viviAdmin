'use client'

import { useState, useEffect } from "react";
import InputComponent from '@/component/inputComponent';
import Link from "next/link";

//style
import './login.scss';

//image
import user from "@/image/inputUserIcon.svg";
import lock from "@/image/inputLockIcon.svg";

export default function Page() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      const response = await fetch("https://ybdigitalx.com/vivi_backend/login_control.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        if (isClient) {
          // Set the adminId as a cookie with an expiry time (e.g., 1 day)
          document.cookie = `adminId=${data.id}; path=/;`;
          window.location.href = "/admin/dashboard"; 
        }
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginPage'>
      <div className="login">
        <h3 className='font-montserrat'>Log In</h3>
        <form onSubmit={handleLogin}>
          <InputComponent
            name="email"
            type="email"
            placeholder="Email"
            leftImage={user}
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputComponent
            name="password"
            type="password"
            placeholder="Password"
            leftImage={lock}
            value={formData.password}
            onChange={handleInputChange}
          />
          {error && <p className="error">{error}</p>}
          <div className="forgotPass">
            <Link className="font-inter" href={'/forgotpassword'}>Forgot password</Link>
          </div>
          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
