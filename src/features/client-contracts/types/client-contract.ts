export interface ClientApprovalRequest {
  reviewVersion: string;
}

export interface ContractChangeRequest {
  feedback: string;
  reviewVersion: string;
}

export interface ContractChangeFeedbackItem {
  id: number;
  feedback: string | null;
  requestedByClientId: number;
  requestedByClientName: string | null;
  requestedAt: string;
}

export interface ContractChangeFeedbackListData {
  items: ContractChangeFeedbackItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ContractChangeFeedbackListResponse {
  success: boolean;
  message: string;
  data: ContractChangeFeedbackListData | null;
  errors: string[] | null;
}
