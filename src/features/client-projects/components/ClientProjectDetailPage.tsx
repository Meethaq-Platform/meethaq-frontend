"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useClientProject } from "../hooks/useClientProject";
import { ProjectStatusBadge } from "@/src/features/projects/components/ProjectStatusBadge";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import { formatCurrency } from "@/src/shared/lib/format";

interface ClientProjectDetailPageProps {
  projectId: string;
}

export default function ClientProjectDetailPage({
  projectId,
}: ClientProjectDetailPageProps) {
  const { data, isLoading, isError, refetch } = useClientProject(projectId);

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/projects"
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message="Failed to load this project."
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4 bg-surface p-6 border border-border rounded-2xl">
            <div className="flex-1">
              <h1 className="font-semibold text-text-primary text-lg">
                {data.title}
              </h1>
              <p className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                {data.description ?? "—"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 w-fit shrink-0">
              <ProjectStatusBadge status={data.status} />
              <p className="text-text-secondary text-sm text-right">
                Created {new Date(data.createdAt).toLocaleDateString()}
              </p>
              {data.totalValue != null && (
                <p className="font-numbers font-semibold text-text-primary text-sm">
                  {formatCurrency(data.totalValue)}
                </p>
              )}
            </div>
          </div>

          <div className="bg-surface p-6 border border-border rounded-2xl">
            <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
              Freelancer
            </p>
            <p className="text-text-primary text-sm">{data.freelancerName}</p>
          </div>

          <Link
            href={`/projects/${data.id}/contract`}
            className="flex justify-between items-center bg-surface hover:bg-surface-muted p-6 border border-border rounded-2xl transition"
          >
            <div>
              <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
                Contract
              </p>
              <ContractStatusBadge status={data.contractStatus} />
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-primary text-sm">
              {data.contractStatus === "None" || data.contractStatus === "Draft"
                ? "Nothing to review yet"
                : "Review Contract"}
              <ArrowRight size={16} />
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
