import type { WorkSubmissionListResponse, WorkSubmissionResponse } from "../types/submission";

// Flat list — no pagination on this endpoint.
export async function getSubmissions(
  projectId: string,
  milestoneId: string,
): Promise<WorkSubmissionListResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/submissions`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load submission history.");
  }

  return result;
}

export interface CreateSubmissionPayload {
  notes: string;
  links: { url: string; label?: string }[];
  files: File[];
}

// Field names match CreateWorkSubmissionDto's multipart binding exactly:
// SubmissionNotes, Files, and EvidenceLinks as ASP.NET Core's standard
// indexed-array-of-complex-object form-data convention
// (EvidenceLinks[0].Url, EvidenceLinks[0].Title, ...).
export async function createSubmission(
  projectId: string,
  milestoneId: string,
  data: CreateSubmissionPayload,
) {
  const formData = new FormData();
  formData.set("SubmissionNotes", data.notes);
  data.links.forEach((link, index) => {
    formData.append(`EvidenceLinks[${index}].Url`, link.url);
    if (link.label) {
      formData.append(`EvidenceLinks[${index}].Title`, link.label);
    }
  });
  for (const file of data.files) {
    formData.append("Files", file);
  }

  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/submissions`,
    { method: "POST", body: formData },
  );

  const result: WorkSubmissionResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit work.");
  }

  return result;
}

export async function remindClient(
  projectId: string,
  milestoneId: string,
  submissionId: number,
): Promise<{ success: boolean; message: string; data: boolean; errors: string[] | null }> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/submissions/${submissionId}/remind`,
    { method: "POST" },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send reminder.");
  }

  return result;
}
