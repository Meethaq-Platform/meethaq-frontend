"use client";

import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

import { useCachedClient } from "../hooks/useCachedClient";
import { ClientAvatar } from "./ClientAvatar";
import EmptyState from "@/src/shared/components/EmptyState";

interface ClientDetailPageProps {
  clientId: string;
}

export default function ClientDetailPage({ clientId }: ClientDetailPageProps) {
  const { data } = useCachedClient(clientId);

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/clients"
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {!data ? (
        <EmptyState
          icon={UserX}
          title="We don't have this client's details yet"
          description="Open this client from the Clients list to view their details."
        />
      ) : (
        <section className="space-y-6">
          <div className="flex items-center gap-4 bg-surface p-6 border border-border rounded-2xl">
            <ClientAvatar
              fullName={data.clientFullName}
              profileImage={data.clientProfileImage}
            />

            <div>
              <h1 className="font-semibold text-text-primary text-lg">
                {data.clientFullName}
              </h1>
              <p className="text-text-secondary text-sm">{data.clientEmail}</p>
              <p className="text-text-secondary text-sm">
                {data.companyName ?? "—"}
              </p>
            </div>
          </div>

          <div className="gap-x-6 gap-y-6 grid grid-cols-1 sm:grid-cols-3 bg-surface p-6 border border-border rounded-2xl">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide">
                Phone
              </p>
              <p className="text-text-primary text-sm">
                {data.clientPhoneNumber ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide">
                Country
              </p>
              <p className="text-text-primary text-sm">
                {data.clientCountry ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide">
                Added
              </p>
              <p className="text-text-primary text-sm">
                {new Date(data.dateAdded).toLocaleDateString()}
              </p>
            </div>

            {data.notes && (
              <div className="sm:col-span-3">
                <p className="text-text-secondary text-xs uppercase tracking-wide">
                  Notes
                </p>
                <p className="text-text-primary text-sm">{data.notes}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
