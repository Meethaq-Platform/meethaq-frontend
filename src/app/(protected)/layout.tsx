import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Header } from "@/src/features/layout/components/Header";
import { Sidebar } from "@/src/features/layout/components/Sidebar";
import { SidebarOverlay } from "@/src/features/layout/components/SidebarOverlay";
import { SidebarProvider } from "@/src/features/layout/context/SidebarContext";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex bg-background h-screen overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <Header />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <SidebarOverlay />
    </SidebarProvider>
  );
}
