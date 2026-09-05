import type { TextareaHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, id, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="font-medium text-text-primary text-sm"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          {...props}
          className={`bg-surface px-4 py-3 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-sm transition resize-none ${className ?? ""}`}
        />
      </div>
    );
  },
);

export default Textarea;
