"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

//style
import "./verifyResetPasswordCode.scss";

//image
import cancel from "@/image/codePageCancel.svg";

interface VerifyCodeProps {
    onClose: () => void; 
}

export default function VerifyResetPasswordCode({ onClose }: VerifyCodeProps) {
    const router = useRouter();
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [email, setEmail] = useState(""); 
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("userEmail");
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (code[index]) {
                const newCode = [...code];
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join("");

        if (verificationCode.length !== 6) {
            setError("Please enter a 6-digit code.");
            return;
        }

        setError("");
        setMessage("Verifying...");
        setLoading(true);

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/verify_code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }), 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setMessage("Verification successful! Redirecting...");
                setTimeout(() => {
                    router.push("/resetpassword");
                }, 2000);
            } 
            else {
                setError("Invalid verification code. Please try again.");
                setMessage("");
            }
        } 
        catch (error: unknown) { 
            console.error("Verification Error:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred.");
            setMessage("");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="verifyResetPasswordCode">
            <div className="modal">
                <div className="cancel" onClick={onClose}>
                    <Image src={cancel} alt="cancel" />
                </div>
                <div className="text">
                    <p className="title font-montserrat">Verification</p>
                    <p className="subText font-inter">
                        Enter the 6-digit code sent to your email.
                    </p>
                    <p className="user-email">Email: {email}</p>
                    <div className="code">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    if (el) inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>

                    {error && <p className="error">{error}</p>}
                    {message && <p className="message">{message}</p>}

                    <div className="button">
                        <button className="font-inter" onClick={handleVerify} disabled={loading}>
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}