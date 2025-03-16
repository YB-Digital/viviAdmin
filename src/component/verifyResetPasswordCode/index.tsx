import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import "./verifyResetPasswordCode.scss";

import cancel from "@/image/codePageCancel.svg";

interface VerifyCodeProps {
    onClose: () => void;
}

export default function VerifyResetPasswordCode({ onClose }: VerifyCodeProps) {
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [code, setCode] = useState<string[]>(new Array(6).fill(""));
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail") || null;
        if (storedEmail) {
            setEmail(storedEmail);
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

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join("");

        if (verificationCode.length !== 6) {
            setError("Please enter a 6-digit code.");
            return;
        }

        setError(null);
        setMessage("Verifying...");
        setLoading(true);

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/verify_code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Verification successful! Redirecting...");
                setTimeout(() => {
                    router.push("/resetpassword");
                }, 2000);
            } else {
                setError("Invalid verification code. Please try again.");
                setMessage("");
            }
        } catch (err) {
            console.error("Verification Error:", err);
            setError("An unknown error occurred. Please try again.");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verifyResetPasswordCode">
            <div className="modal">
                <div className="cancel" onClick={onClose}>
                    <Image src={cancel} alt="cancel" width={24} height={24} />
                </div>
                <div className="text">
                    <p className="title font-montserrat">Verification</p>
                    <p className="subText font-inter">Enter the 6-digit code sent to your email.</p>
                    <p className="user-email">Email: {email}</p>

                    <div className="code">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                className="digitInput"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    {error && <p className="error">{error}</p>} {/* ✅ Ensure error is always displayed */}
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
