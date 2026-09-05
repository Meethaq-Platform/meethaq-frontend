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

interface ClientDetailPageProps {
  clientId: string;
}

export default function ClientDetailPage({ clientId }: ClientDetailPageProps) {
  const { data, isLoading, isError, refetch } = useClient(clientId);
  const [isEditing, setIsEditing] = useState(false);
  const isSaving = useIsMutating({ mutationKey: ["update-client"] }) > 0;

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <Link
          href="/clients"
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
        >
          <ArrowLeft size={16} />
          Back to Clients
        </Link>

        {data &&
          (isEditing ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition"
              >
                Cancel
              </button>

              <Button
                type="submit"
                form="client-edit-form"
                loading={isSaving}
                loadingText="Saving..."
                className="h-9"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition"
            >
              <Pencil size={14} />
              Edit
            </Button>
          ))}
      </div>

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
            </div>
          </div>

          <div className="space-y-6 bg-surface p-6 border border-border rounded-2xl">
            <div className="gap-x-6 gap-y-6 grid grid-cols-1 sm:grid-cols-3">
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
            </div>

            <div className="pt-6 border-border border-t">
              {isEditing ? (
                <EditClientForm
                  client={data}
                  onSuccess={() => setIsEditing(false)}
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
          </div>
        </section>
      )}
    </div>
  );
}
