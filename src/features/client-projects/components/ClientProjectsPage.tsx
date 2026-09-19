"use client";

import { useState } from "react";

import { InvitationsSection } from "./InvitationsSection";
import { ClientProjectsSection } from "./ClientProjectsSection";
import Tabs from "@/src/shared/components/Tabs";

type Tab = "invitations" | "projects";

const tabs: { value: Tab; label: string }[] = [
  { value: "projects", label: "My Projects" },
  { value: "invitations", label: "Invitations" },
];

export default function ClientProjectsPage() {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <>
      <Tabs value={tab} onChange={setTab} options={tabs} />

      {tab === "invitations" ? (
        <InvitationsSection />
      ) : (
        <ClientProjectsSection />
      )}
    </>
  );
}
