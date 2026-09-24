import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, className, rightElement, dir, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  // Emails, URLs and phone numbers read left-to-right even in RTL. Set on the
  // wrapper so the right-element slot and its padding mirror together.
  const direction =
    dir ?? (props.type === "email" || props.type === "url" || props.type === "tel" ? "ltr" : undefined);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="font-medium text-text-primary text-sm">
        {label}
      </label>
      <div className="relative" dir={direction}>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={`bg-surface px-4 ${rightElement ? "pe-11" : ""} border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary placeholder:text-text-secondary text-sm transition ${className ?? ""}`}
        />
        {rightElement && (
          <div className="top-1/2 inset-e-3 absolute -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
});

export default Input;
