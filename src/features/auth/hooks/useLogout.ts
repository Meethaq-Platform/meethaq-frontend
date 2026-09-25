"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/service";

export function useLogout() {
  const router = useRouter();
  // Pending covers both the request and the navigation to /login.
  const [isPending, startTransition] = useTransition();

  function logout() {
    startTransition(async () => {
      try {
        await logoutUser();
        router.push("/login");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  }

  return { logout, isPending };
}
