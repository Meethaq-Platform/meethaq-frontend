import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
}

export default function Button({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`bg-primary hover:opacity-90 disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-white text-sm active:scale-[0.99] transition disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {loading ? loadingText : children}
    </button>
  );
}
