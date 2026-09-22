import Link from "next/link";
import { Mail } from "lucide-react";
import type { ClientFirstUse as ClientFirstUseDto } from "../types/dashboard";

interface ClientFirstUseProps {
  firstUse: ClientFirstUseDto;
  userName: string | null;
}

// Feature 25. Never grants access on its own — it only surfaces the existing
// pending-invitation acceptance flow (Invitations tab on /projects) when one
// exists, per the sprint rule that the Dashboard must not link/name-match
// its way into a Project.
export default function ClientFirstUse({ firstUse, userName }: ClientFirstUseProps) {
  return (
    <section className="bg-surface p-6 sm:p-8 border border-border rounded-2xl text-center">
      <h1 className="font-bold text-text-primary text-xl sm:text-2xl">
        Welcome, {userName ?? "there"}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-text-secondary text-sm">
        {firstUse.guidanceMessage ??
          "Your Projects will appear here when a Freelancer shares access with you."}
      </p>

      {firstUse.pendingInvitationsCount > 0 && (
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-primary hover:opacity-90 mt-5 px-4 rounded-xl h-10 font-semibold text-white text-sm transition"
        >
          <Mail size={15} />
          Review {firstUse.pendingInvitationsCount} Pending{" "}
          {firstUse.pendingInvitationsCount === 1 ? "Invitation" : "Invitations"}
        </Link>
      )}
    </section>
  );
}
