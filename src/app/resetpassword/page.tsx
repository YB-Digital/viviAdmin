"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/component/inputComponent";

//style
import "./resetpassword.scss";

//image
import eye from "@/image/eyeIcon.svg";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        error: "",
        loading: false,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("userEmail");
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormData((prev) => ({ ...prev, error: "", loading: true }));

        if (!email.trim()) {
            setFormData((prev) => ({ ...prev, error: "Please enter your email address.", loading: false }));
            return;
        }

        if (!formData.password || !formData.confirmPassword) {
            setFormData((prev) => ({ ...prev, error: "Please fill in all fields.", loading: false }));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setFormData((prev) => ({ ...prev, error: "Passwords do not match!", loading: false }));
            return;
        }

        try {
            const response = await fetch("https://viviacademy.de/vivi_Adminbackend/reset_password.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password: formData.password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error || "Failed to reset password.");
            }

            alert("Password successfully reset! Redirecting to login...");
            router.push("/login");

        } catch (error) {
            console.error("Reset Password Error:", error);
            setFormData((prev) => ({ ...prev, error: error instanceof Error ? error.message : "An unknown error occurred." }));
        } finally {
            setFormData((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className="resetpassword">
            <form onSubmit={handleSubmit}>
                <h3 className="font-montserrat">New Password</h3>
                <InputComponent
                    name="password"
                    type="password"
                    placeholder="Password"
                    rightImage={eye}
                    value={formData.password}
                    onChange={handleChange}
                />
                
                <InputComponent
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    rightImage={eye}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                {formData.error && <p className="error">{formData.error}</p>}
                
                <button type="submit" className="font-inter" disabled={formData.loading}>
                    {formData.loading ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    );
}