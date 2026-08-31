import UserMenu from "@/src/features/auth/components/UserMenu";

export default function Dashboard() {
  return (
    <>
      <div className="flex justify-between px-16 py-4">
        <h1>Dashboard</h1>
        <UserMenu />
      </div>
    </>
  );
}
