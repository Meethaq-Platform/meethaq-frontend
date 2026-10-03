"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { INVITATIONS_PAGE_SIZE, InvitationsSection } from "./InvitationsSection";
import { useInvitations } from "../hooks/useInvitations";
import { ClientProjectsSection } from "./ClientProjectsSection";
import Tabs from "@/src/shared/components/Tabs";

type Tab = "invitations" | "projects";

const tabs: Tab[] = ["projects", "invitations"];

export default function ClientProjectsPage() {
  const t = useTranslations("clientProjects.tabs");
  const [tab, setTab] = useState<Tab>("projects");
  // The list only holds pending invitations (accepting one turns it into a
  // project), so any at all means something waits on the client. Same
  // query as the tab's first page, so it's shared, not an extra request.
  const invitations = useInvitations({ pageNumber: 1, pageSize: INVITATIONS_PAGE_SIZE });
  const hasInvitations = (invitations.data?.totalCount ?? 0) > 0;

  return (
    <>
      <Tabs
        value={tab}
        onChange={setTab}
        options={tabs.map((value) => ({
          value,
          label: t(value),
          dot: value === "invitations" && hasInvitations,
        }))}
      />

      {tab === "invitations" ? (
        <InvitationsSection />
      ) : (
        <ClientProjectsSection />
      )}
    </>
  );
}
