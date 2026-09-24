"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { InvitationsSection } from "./InvitationsSection";
import { ClientProjectsSection } from "./ClientProjectsSection";
import Tabs from "@/src/shared/components/Tabs";

type Tab = "invitations" | "projects";

const tabs: Tab[] = ["projects", "invitations"];

export default function ClientProjectsPage() {
  const t = useTranslations("clientProjects.tabs");
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <>
      <Tabs
        value={tab}
        onChange={setTab}
        options={tabs.map((value) => ({ value, label: t(value) }))}
      />

      {tab === "invitations" ? (
        <InvitationsSection />
      ) : (
        <ClientProjectsSection />
      )}
    </>
  );
}
