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
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("userEmail");
            if (storedEmail) setEmail(storedEmail);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value.trim();
        setEmail(newEmail);

        if (typeof window !== "undefined") {
            localStorage.setItem("userEmail", newEmail);
        }
    };

    const handleSendClick = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/send_reset_code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("userInfo", JSON.stringify({ email }));
                }
                setShowVerifyCode(true);
            } else {
                setError(data.error || "Error sending reset code. Please try again.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
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

            {error && <p className="error">{error}</p>}

            <button className="font-inter" onClick={handleSendClick} disabled={loading}>
                {loading ? "Sending..." : "Send"}
            </button>

            {showVerifyCode && <VerifyResetPasswordCode onClose={() => setShowVerifyCode(false)} />}
        </div>
    );
}