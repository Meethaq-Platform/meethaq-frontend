import type { Metadata } from "next";
import ProfilePage from "@/src/features/profile/components/ProfilePage";

export const metadata: Metadata = { title: "Profile" };

export default function Profile() {
  return <ProfilePage />;
}
