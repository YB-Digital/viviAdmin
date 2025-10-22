"use client";

import { useState } from "react";
import InputComponent from "@/component/inputComponent";
import user from "@/image/inputUserIcon.svg";
import lock from "@/image/inputLockIcon.svg";
import "./login.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`https://api.viviacademy.xyz/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Email veya şifre hatalı!");
        return;
      }

      const token = data.data?.token;
      const userId = data.data?.token; // adminId yerine userId kullanıyoruz

      if (!token || !userId) {
        setError("Gerekli bilgiler alınamadı!");
        return;
      }

      // ✅ LocalStorage’a kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("adminId", token);
      localStorage.setItem("email", email);

      // ✅ Yönlendirme
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="login">
        <h3 className="font-montserrat">Log In</h3>
        <form onSubmit={handleLogin}>
          <InputComponent
            name="email"
            type="email"
            placeholder="Email"
            leftImage={user}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputComponent
            name="password"
            type="password"
            placeholder="Password"
            leftImage={lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
