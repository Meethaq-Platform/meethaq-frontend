import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Loader2
        size={size}
        className={`animate-spin text-primary ${className ?? ""}`}
      />
      <span>Loading...</span>
    </div>
  );
}
