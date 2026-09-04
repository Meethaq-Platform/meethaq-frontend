import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 py-16 text-center">
      <AlertCircle size={32} className="text-danger" />

      <p className="text-text-secondary text-sm">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary hover:opacity-90 px-4 rounded-xl h-10 font-semibold text-white text-sm transition"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
