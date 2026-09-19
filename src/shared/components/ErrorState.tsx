import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 py-12 h-full text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/error.svg"
        alt=""
        className="w-40 h-40 object-contain"
      />

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
