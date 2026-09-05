import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition"
    >
      <Bell size={20} />
      <span className="top-1.5 right-1.5 absolute bg-danger rounded-full w-2 h-2" />
    </button>
  );
}
