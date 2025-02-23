"use client";

import { useState, useEffect } from "react";
import InputComponent from "@/component/inputComponent";
import VerifyResetPasswordCode from "@/component/verifyResetPasswordCode";

//style
import "./forgotpassword.scss";

//image
import user from "@/image/inputUserIcon.svg";

export default function Page() {
    const [email, setEmail] = useState<string>("");
    const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("adminEmail");
            if (storedEmail) setEmail(storedEmail);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value.trim();
        setEmail(newEmail);

        if (typeof window !== "undefined") {
            localStorage.setItem("adminEmail", newEmail);
        }
    };

    const handleSendClick = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        // Geçerli email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/send_reset_code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: email }),
            });
         

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("adminEmail", email);
                setShowVerifyCode(true);
            } else {
                setError(data.error || "Error sending reset code. Please try again.");
            }
        } catch (error: any) {
            setError(error.message || "Server error. Please try again later.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgotpassword">
            <h3 className="font-montserrat">Forgot Password</h3>
            <p className="font-inter">
                You can reset your password using the link sent to the e-mail you entered.
            </p>
            <InputComponent 
                type="email" 
                placeholder="Enter your email" 
                leftImage={user} 
                value={email}
                onChange={handleInputChange} 
            />

            {error && <p className="error text-red-600">{error}</p>}

            <button className="font-inter" onClick={handleSendClick} disabled={loading}>
                {loading ? "Sending..." : "Send"}
            </button>

            {showVerifyCode && <VerifyResetPasswordCode onClose={() => setShowVerifyCode(false)} />}
        </div>
    );
}
