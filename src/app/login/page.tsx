// "use client";

// import { useState, useEffect } from "react";
// import InputComponent from "@/component/inputComponent";
// import Link from "next/link";

// //style
// import "./login.scss";

// //image
// import user from "@/image/inputUserIcon.svg";
// import lock from "@/image/inputLockIcon.svg";

// export default function Page() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(typeof window !== "undefined");
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://api.viviacademy.xyz/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Login failed. Please check your credentials.");
//       }

//       const data = await response.json();

//       if (data.status === "error") {
//         setError(data.message);
//       } else {
//         if (isClient) {
//           window.localStorage.setItem("adminId", data.id);
//           window.location.href = "/admin/dashboard";
//         }
//       }
//     } catch (error) {
//       setError("Network error. Please try again later.");
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="loginPage">
//       <div className="login">
//         <h3 className="font-montserrat">Log In</h3>
//         <form onSubmit={handleLogin}>
//           <InputComponent
//             name="email"
//             type="email"
//             placeholder="Email"
//             leftImage={user}
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//           <InputComponent
//             name="password"
//             type="password"
//             placeholder="Password"
//             leftImage={lock}
//             value={formData.password}
//             onChange={handleInputChange}
//           />
//           {error && <p className="error">{error}</p>}
//           {/* <div className="forgotPass">
//             <Link className="font-inter" href={'/forgotpassword'}>Forgot password</Link>
//           </div> */}
//           <button type="submit" className="loginButton" disabled={loading}>
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
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
      const data = await fetch(`https://api.viviacademy.xyz/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(res => res.json());

      console.log("Login response:", data);

      if (!data.success) {
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
