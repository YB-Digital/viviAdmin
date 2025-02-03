"use client";

import { useState } from "react";
import Image from "next/image";

//style
import "./inputComponent.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftImage?: string;
  rightImage?: string;
  visible?: string;
  disabled?: boolean;
}

export default function InputComponent({ rightImage, visible, leftImage, type, disabled = false, ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className={`inputComponent ${leftImage ? "extraPad" : ""}`}>
      {leftImage && <Image className="leftImage" src={leftImage} alt="icon" />}

      <input {...props} type={isPasswordField && isPasswordVisible ? "text" : type} required disabled={disabled} />

      {isPasswordField && rightImage && (
        <Image
          className="rightImage"
          src={isPasswordVisible ? visible || rightImage : rightImage}
          alt="toggle password"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        />
      )}
    </div>
  );
}