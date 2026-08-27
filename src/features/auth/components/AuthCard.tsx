interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md h-[400px] overflow-y-auto">{children}</div>
  );
}
