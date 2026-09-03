"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/service";

export function useLogout() {
  const router = useRouter();

  return async function logout() {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
}
