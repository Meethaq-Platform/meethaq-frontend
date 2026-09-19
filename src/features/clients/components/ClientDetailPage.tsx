"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useClient } from "../hooks/useClient";
import { ClientAvatar } from "./ClientAvatar";
import { EditClientForm } from "./EditClientForm";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import { formatDate } from "@/src/shared/lib/format";

interface ClientDetailPageProps {
  clientId: string;
}

export default function ClientDetailPage({ clientId }: ClientDetailPageProps) {
  const { data, isLoading, isError, refetch } = useClient(clientId);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isSaving = useIsMutating({ mutationKey: ["update-client"] }) > 0;

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/clients"
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message="Failed to load this client."
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          {/* Header: avatar + identity + contact metadata merged in one
              place, actions alongside — mirrors ProjectDetailPage's header. */}
          <div className="bg-(--amber-bg) p-6 border border-border rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <ClientAvatar
                  fullName={data.clientFullName}
                  profileImage={data.clientProfileImage}
                />

                <div className="min-w-0">
                  <h1 className="font-bold text-text-primary text-xl md:text-2xl truncate">
                    {data.clientFullName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-text-secondary text-sm">
                    <span>{data.clientEmail}</span>
                    {data.clientPhoneNumber && (
                      <>
                        <span aria-hidden className="text-border">
                          ·
                        </span>
                        <span>{data.clientPhoneNumber}</span>
                      </>
                    )}
                    {data.clientCountry && (
                      <>
                        <span aria-hidden className="text-border">
                          ·
                        </span>
                        <span>{data.clientCountry}</span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-text-secondary text-xs">
                    Added {formatDate(data.dateAdded)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="amber"
                      onClick={() => setIsEditing(false)}
                      className="h-9"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      form="client-edit-form"
                      disabled={!isFormDirty}
                      loading={isSaving}
                      loadingText="Saving..."
                      className="h-9"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      setIsFormDirty(false);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 h-9"
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 border border-border rounded-2xl">
            <p className="mb-4 font-semibold text-text-secondary text-xs uppercase tracking-wide">
              Details
            </p>

            {isEditing ? (
              <EditClientForm
                client={data}
                onSuccess={() => setIsEditing(false)}
                onDirtyChange={setIsFormDirty}
              />
            ) : (
              <div className="gap-x-6 gap-y-6 grid grid-cols-1 sm:grid-cols-3">
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-wide">
                    Company
                  </p>
                  <p className="text-text-primary text-sm">
                    {data.companyName ?? "—"}
                  </p>
                </div>

                {data.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-text-secondary text-xs uppercase tracking-wide">
                      Notes
                    </p>
                    <p className="text-text-primary text-sm">{data.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
