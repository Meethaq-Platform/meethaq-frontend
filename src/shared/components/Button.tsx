import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "amber" | "danger";
}

const variantBg: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-on-primary",
  amber: "bg-accent-value text-on-accent-value",
  danger: "bg-danger text-white",
};

export default function Button({
  children,
  loading = false,
  loadingText = "Loading...",
  variant = "primary",
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={twMerge(
        `${variantBg[variant]} cursor-pointer hover:opacity-90 disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-sm active:scale-[0.99] transition disabled:cursor-not-allowed`,
        className
      )}
    >
      {loading ? loadingText : children}
    </button>
  );
}
