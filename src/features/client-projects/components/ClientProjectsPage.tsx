"use client";

import { useState } from "react";

import { InvitationsSection } from "./InvitationsSection";
import { ClientProjectsSection } from "./ClientProjectsSection";

type Tab = "invitations" | "projects";

const tabs: { value: Tab; label: string }[] = [
  { value: "projects", label: "My Projects" },
  { value: "invitations", label: "Invitations" },
];

export default function ClientProjectsPage() {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <>
      <div className="inline-flex bg-surface-muted p-1 rounded-xl">
        {tabs.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            className={`px-4 h-9 rounded-lg font-semibold text-sm transition ${
              tab === option.value
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "invitations" ? (
        <InvitationsSection />
      ) : (
        <ClientProjectsSection />
      )}
    </>
  );
}
