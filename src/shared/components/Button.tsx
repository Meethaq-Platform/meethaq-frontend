import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  /** Show a spinner beside the loading text. */
  spinner?: boolean;
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
  spinner = false,
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
        `${variantBg[variant]} cursor-pointer hover:opacity-90 disabled:opacity-60 px-4 rounded-lg h-11 font-semibold text-sm active:scale-[0.99] transition disabled:cursor-not-allowed`,
        className,
      )}
    >
      {loading && spinner ? (
        <span className="inline-flex justify-center items-center gap-2">
          <Loader2 size={16} className="animate-spin shrink-0" aria-hidden />
          {loadingText}
        </span>
      ) : loading ? (
        loadingText
      ) : (
        children
      )}
    </button>
  );
}
