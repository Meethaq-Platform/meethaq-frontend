import { LogoutButton } from "@/src/features/auth/components/LogoutButton";

export default function Dashboard() {
  return (
    <div className="flex justify-between px-16 py-4">
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
