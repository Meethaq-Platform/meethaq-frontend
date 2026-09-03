import { AuthIllustration } from "@/src/features/auth/components/AuthIllustration";
import AuthTabs from "@/src/features/auth/components/AuthTabs";
import Brand from "@/src/shared/components/Brand";

import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex justify-center items-center bg-[radial-gradient(circle_at_top_left,var(--teal-100),transparent_35%),radial-gradient(circle_at_bottom_right,var(--amber-50),transparent_30%)] bg-background px-4 py-8 min-h-screen">
      <div className="flex justify-center w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-surface shadow-2xl p-0 border border-border rounded-3xl w-full sm:w-150 lg:w-full lg:h-150 overflow-hidden">
          <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
            <div className="flex flex-wrap justify-between items-center">
              <Brand />
              <AuthTabs />
            </div>
            {children}
          </div>

          <AuthIllustration />
        </div>
      </div>
    </main>
  );
}
