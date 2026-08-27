import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, className, ...props },
  ref,
) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="font-medium text-text-primary text-sm">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        {...props}
        className={`bg-surface px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary placeholder:text-text-secondary text-sm transition ${className ?? ""}`}
      />
    </div>
  );
});

export default Input;
