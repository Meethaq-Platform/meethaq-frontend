import type { ButtonHTMLAttributes } from "react";
import { Pencil } from "lucide-react";

export function EditButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`flex items-center gap-1.5 bg-accent-value hover:opacity-90 px-4 rounded-lg h-9 font-semibold text-white text-sm transition ${className ?? ""}`}
    >
      Edit
      <Pencil size={14} />
    </button>
  );
}
