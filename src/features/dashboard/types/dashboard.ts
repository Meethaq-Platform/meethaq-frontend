// Every interface here mirrors a DTO pulled directly from the live swagger
// spec at /swagger/v1/swagger.json (FreelancerDashboard / ClientDashboard
// controllers) — field names and casing are verified, not guessed.
//
// Two enums on ActionCenterItemDto (urgencyLevel, ownershipType) are raw
// integers with no x-enumNames in the spec, so their exact ordinal meaning
// is undocumented. We deliberately avoid hardcoding a guessed mapping for
// ownership (see ActionCenterList.tsx: it derives "your action" vs "waiting"
// from which of deadlineUtc/waitingSinceUtc is populated instead, which is
// unambiguous). urgencyLevel is used only to tint the already-human-readable
// `priorityBadge` string the backend provides, never to relabel or re-sort
// (the items array's order is trusted as backend-authoritative).

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
}

// Mirrors *DashboardSection<T> — every slice of the aggregate dashboard is
// wrapped in one of these so a single section failing (hasError) never takes
// down the rest of the page.
export interface DashboardSection<T> {
  status: number;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  generatedAtUtc: string;
  data: T | null;
}

export interface QuickActionShortcut {
  key: string | null;
  label: string | null;
  icon: string | null;
  navigationUrl: string | null;
}

export interface WelcomeSummary {
  userName: string | null;
  currentDateUtc: string;
  summaryText: string | null;
  quickActions: QuickActionShortcut[] | null;
}

export interface ActionCenterItem {
  actionId: string | null;
  actionType: string | null;
  urgencyLevel: number;
  ownershipType: number;
  projectId: number;
  projectName: string | null;
  counterpartyId: string;
  counterpartyName: string | null;
  relatedEntityType: string | null;
  relatedEntityId: number;
  relatedRecordTitle: string | null;
  amount: number | null;
  currency: string | null;
  deadlineUtc: string | null;
  waitingSinceUtc: string | null;
  priorityBadge: string | null;
  actionButtonText: string | null;
  actionApiUrl: string | null;
  actionNavigationUrl: string | null;
}

export interface ActionCenterSummary {
  totalPendingCount: number;
  overdueCount: number;
  approachingDeadlinesCount: number;
  items: ActionCenterItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface FinancialMetricCard {
  metricKey: string | null;
  title: string | null;
  amount: number;
  currency: string | null;
  period: string | null;
  definitionTooltip: string | null;
  isAdditiveWithTotal: boolean;
  drillDownApiUrl: string | null;
  drillDownNavigationUrl: string | null;
}

export interface FreelancerFinancialOverview {
  selectedCurrency: string | null;
  availableCurrencies: string[] | null;
  totalIncomeReceived: FinancialMetricCard;
  approvedProjectValue: FinancialMetricCard;
  totalUnpaidValue: FinancialMetricCard;
  onDisputeHold: FinancialMetricCard;
  paymentIssues: FinancialMetricCard;
  awaitingReceiptConfirmation: FinancialMetricCard;
  readyForClientPayment: FinancialMetricCard;
  notYetEligible: FinancialMetricCard;
  incomeReceivedThisMonth: FinancialMetricCard;
  acceptedWorkValue: FinancialMetricCard;
}

export interface ClientFinancialOverview {
  selectedCurrency: string | null;
  availableCurrencies: string[] | null;
  totalConfirmedPayments: FinancialMetricCard;
  approvedProjectValue: FinancialMetricCard;
  totalUnpaidValue: FinancialMetricCard;
  onDisputeHold: FinancialMetricCard;
  paymentIssues: FinancialMetricCard;
  awaitingFreelancerConfirmation: FinancialMetricCard;
  readyForPayment: FinancialMetricCard;
  futureMilestoneValue: FinancialMetricCard;
  confirmedPaymentsThisMonth: FinancialMetricCard;
}

export interface FinancialTrendPoint {
  periodLabel: string | null;
  year: number;
  month: number;
  periodStartUtc: string;
  periodEndUtc: string;
  confirmedAmount: number;
  currency: string | null;
  transactionCount: number;
}

export interface FinancialTrend {
  periodMonths: number;
  currency: string | null;
  timezone: string | null;
  totalAmount: number;
  points: FinancialTrendPoint[] | null;
}

export interface ActiveProjectSummary {
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  projectStatus: string | null;
  contractStatus: string | null;
  approvedValue: number | null;
  currency: string | null;
  acceptedMilestonesCount: number;
  totalMilestonesCount: number;
  progressText: string | null;
  nextMilestoneTitle: string | null;
  nextMilestoneDueUtc: string | null;
  totalPaidAmount: number;
  hasActiveDispute: boolean;
  latestActivitySummary: string | null;
  latestActivityUtc: string | null;
  primaryActionLabel: string | null;
  primaryActionNavigationUrl: string | null;
}

export interface ProjectOverviewSummary {
  totalProjects: number;
  draftProjects: number;
  activeProjects: number;
  completedProjects: number;
  cancelledProjects: number;
  awaitingApprovalProjects: number;
  overdueMilestoneProjects: number;
  openDisputeProjects: number;
  activeProjectsList: ActiveProjectSummary[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface ClientProjectOverviewSummary {
  totalAssignedProjects: number;
  activeProjects: number;
  completedProjects: number;
  contractsAwaitingApproval: number;
  deliverablesAwaitingReview: number;
  projectsWithOverdueMilestones: number;
  projectsWithOpenDisputes: number;
  projectsList: ActiveProjectSummary[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface UpcomingMilestoneItem {
  milestoneId: number;
  milestoneTitle: string | null;
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  dueDateUtc: string;
  agreedAmount: number;
  currency: string | null;
  executionStatus: string | null;
  isOverdue: boolean;
  daysUntilDue: number;
  actionLabel: string | null;
  actionNavigationUrl: string | null;
}

export interface ClientSummaryItem {
  clientId: number;
  clientName: string | null;
  companyName: string | null;
  totalSharedProjects: number;
  activeProjectsCount: number;
  confirmedIncome: number;
  acceptedUnpaidAmount: number;
  currency: string | null;
  latestActivityUtc: string | null;
  openActionNavigationUrl: string | null;
}

export interface FreelancerClientOverview {
  totalClients: number;
  clientsWithActiveProjects: number;
  clientsWithAcceptedUnpaidWork: number;
  clientsWithOpenDisputes: number;
  clientsList: ClientSummaryItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface FreelancerSummaryItem {
  freelancerUserId: string;
  freelancerName: string | null;
  professionalTitle: string | null;
  totalSharedProjects: number;
  activeProjectsCount: number;
  confirmedPayments: number;
  acceptedUnpaidAmount: number;
  currency: string | null;
  nextDeliveryDateUtc: string | null;
  latestActivityUtc: string | null;
  sharedProjectsNavigationUrl: string | null;
  conversationNavigationUrl: string | null;
}

export interface ClientFreelancersOverview {
  totalConnectedFreelancers: number;
  freelancersWithActiveProjects: number;
  freelancersList: FreelancerSummaryItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface RecentAgreementItem {
  contractId: number;
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  contractStatus: string | null;
  totalAmount: number;
  currency: string | null;
  updatedAtUtc: string;
  navigationUrl: string | null;
}

export interface AgreementOverview {
  draftContractsCount: number;
  pendingApprovalContractsCount: number;
  changesRequestedContractsCount: number;
  approvedContractsCount: number;
  changeRequestsAwaitingUserCount: number;
  changeRequestsAwaitingCounterpartyCount: number;
  recentAgreements: RecentAgreementItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface ClientAgreementOverview {
  contractsAwaitingApprovalCount: number;
  approvedContractsCount: number;
  changeRequestsAwaitingClientCount: number;
  changeRequestsAwaitingFreelancerCount: number;
  recentAgreements: RecentAgreementItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface DisputeItem {
  disputeId: number;
  milestoneId: number;
  milestoneTitle: string | null;
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  disputeStatus: string | null;
  category: string | null;
  holdAmount: number;
  currency: string | null;
  requiresCurrentUserResponse: boolean;
  createdAtUtc: string;
  navigationUrl: string | null;
}

export interface DisputeOverview {
  totalOpenDisputes: number;
  awaitingUserResponseCount: number;
  awaitingCounterpartyCount: number;
  totalHoldAmountByCurrency: Record<string, number> | null;
  recentDisputes: DisputeItem[] | null;
  viewAllApiUrl: string | null;
  viewAllNavigationUrl: string | null;
}

export interface RecentConversation {
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  latestMessageSnippet: string | null;
  latestMessageSentAtUtc: string;
  unreadMessageCount: number;
  conversationNavigationUrl: string | null;
}

export interface RecentActivityItem {
  eventId: number;
  projectId: number;
  projectName: string | null;
  eventType: string | null;
  description: string | null;
  performedByUserId: string;
  performedByName: string | null;
  timestampUtc: string;
  relatedEntityType: string | null;
  relatedEntityId: number | null;
  navigationUrl: string | null;
}

export interface DeliverableReviewItem {
  submissionId: number;
  milestoneId: number;
  milestoneTitle: string | null;
  projectId: number;
  projectName: string | null;
  freelancerName: string | null;
  versionNumber: number;
  submittedAtUtc: string;
  reviewDeadlineUtc: string;
  isOverdue: boolean;
  daysRemaining: number;
  milestoneValue: number;
  currency: string | null;
  reviewNavigationUrl: string | null;
}

export interface FreelancerFirstUse {
  isFirstUse: boolean;
  step1_ClientAdded: boolean;
  step2_ProjectCreated: boolean;
  step3_ContractPrepared: boolean;
  step4_ContractSentForApproval: boolean;
  showCompactOnboardingWidget: boolean;
}

export interface ClientFirstUse {
  isFirstUse: boolean;
  pendingInvitationsCount: number;
  guidanceMessage: string | null;
}

export interface PaymentFollowUpItem {
  milestoneId: number;
  milestoneTitle: string | null;
  projectId: number;
  projectName: string | null;
  counterpartyName: string | null;
  amount: number;
  currency: string | null;
  paymentCategory: string | null;
  acceptanceDateUtc: string;
  paymentDueDateUtc: string | null;
  isDisputed: boolean;
  actionLabel: string | null;
  actionApiUrl: string | null;
  actionNavigationUrl: string | null;
}

export interface PaymentFollowUpSummary {
  totalCount: number;
  totalAmount: number;
  currency: string | null;
  items: PaymentFollowUpItem[] | null;
}

export interface FreelancerDashboard {
  welcome: DashboardSection<WelcomeSummary>;
  actionCenter: DashboardSection<ActionCenterSummary>;
  financialOverview: DashboardSection<FreelancerFinancialOverview>;
  financialTrend: DashboardSection<FinancialTrend>;
  projectOverview: DashboardSection<ProjectOverviewSummary>;
  upcomingMilestones: DashboardSection<UpcomingMilestoneItem[]>;
  clientOverview: DashboardSection<FreelancerClientOverview>;
  agreements: DashboardSection<AgreementOverview>;
  disputes: DashboardSection<DisputeOverview>;
  recentMessages: DashboardSection<RecentConversation[]>;
  recentActivity: DashboardSection<RecentActivityItem[]>;
  firstUse: DashboardSection<FreelancerFirstUse>;
  lastUpdatedAtUtc: string;
}

export interface ClientDashboard {
  welcome: DashboardSection<WelcomeSummary>;
  actionCenter: DashboardSection<ActionCenterSummary>;
  financialOverview: DashboardSection<ClientFinancialOverview>;
  financialTrend: DashboardSection<FinancialTrend>;
  projectOverview: DashboardSection<ClientProjectOverviewSummary>;
  deliverablesAwaitingReview: DashboardSection<DeliverableReviewItem[]>;
  upcomingMilestones: DashboardSection<UpcomingMilestoneItem[]>;
  freelancersOverview: DashboardSection<ClientFreelancersOverview>;
  agreements: DashboardSection<ClientAgreementOverview>;
  disputes: DashboardSection<DisputeOverview>;
  recentMessages: DashboardSection<RecentConversation[]>;
  recentActivity: DashboardSection<RecentActivityItem[]>;
  firstUse: DashboardSection<ClientFirstUse>;
  lastUpdatedAtUtc: string;
}

export type FreelancerDashboardResponse = ApiResponse<FreelancerDashboard>;
export type ClientDashboardResponse = ApiResponse<ClientDashboard>;
export type FinancialTrendResponse = ApiResponse<FinancialTrend>;
export type PaymentFollowUpResponse = ApiResponse<PaymentFollowUpSummary>;

export type TrendPeriod = 6 | 12;

export type DashboardRole = "freelancer" | "client";
