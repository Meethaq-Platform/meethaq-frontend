"use client";

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";

import Input from "./Input";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, ...props }, ref) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <Input
        ref={ref}
        label={label}
        {...props}
        type={isVisible ? "text" : "password"}
        rightElement={
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="text-text-secondary hover:text-text-primary transition"
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
    );
  },
);

export default PasswordInput;
