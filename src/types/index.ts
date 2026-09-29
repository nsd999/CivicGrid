// CivicGrid — Core TypeScript Types
// Shared across all modules

export type UserRole =
  | "CITIZEN"
  | "FIELD_WORKER"
  | "DEPARTMENT_OFFICER"
  | "DISTRICT_OFFICER"
  | "ADMINISTRATOR";

export type Module =
  | "CIVICGRID_CORE"
  | "SWASTHYAGRID"
  | "SURAKSHAGRID"
  | "MONSOONSHIELD"
  | "HEATSAFE_INDIA"
  | "SYSTEM";

export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ActionStatus =
  | "NEW"
  | "REVIEWING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "RESOLVED"
  | "VERIFIED"
  | "CLOSED";

export type EventStatus =
  | "DETECTED"
  | "ANALYZING"
  | "CORRELATED"
  | "PRIORITISED"
  | "ACTION_CREATED"
  | "ASSIGNED"
  | "RESOLVED"
  | "VERIFIED";

export type EventSource =
  | "CITIZEN_REPORT"
  | "GOVERNMENT_DATASET"
  | "WEATHER"
  | "SENSOR"
  | "OFFICER"
  | "SYSTEM_DETECTION";

export type NotificationType = "INFO" | "WARNING" | "HIGH" | "CRITICAL";

export type MissionStatus = "ACTIVE" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";

export type AssetType =
  | "HOSPITAL"
  | "PHC"
  | "SCHOOL"
  | "BRIDGE"
  | "POWER_SUBSTATION"
  | "WATER_FACILITY"
  | "EMERGENCY_SHELTER"
  | "ROAD"
  | "TELECOM_INFRASTRUCTURE"
  | "GOVERNMENT_BUILDING"
  | "DRAINAGE"
  | "OTHER";

export type ReportCategory =
  | "ROAD"
  | "DRAINAGE"
  | "WASTE"
  | "STREETLIGHT"
  | "WATER"
  | "PUBLIC_BUILDING"
  | "PUBLIC_TRANSPORT"
  | "HEALTH"
  | "OTHER";

// ============================================================
// USER / AUTH
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  locationId?: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================================
// PRIORITY ENGINE
// ============================================================

export interface PriorityFactor {
  factor: string;
  label: string;
  value: number | string;
  weight: number;
  contribution: number;
}

export interface PriorityResult {
  priority: Priority;
  score: number;
  factors: PriorityFactor[];
  explanation?: string;
  aiConfidence?: number;
  aiProvider?: string;
  computedAt: string;
}

// ============================================================
// EVENTS
// ============================================================

export interface Event {
  id: string;
  title: string;
  description: string;
  module: Module;
  source: EventSource;
  status: EventStatus;
  severity: Priority;
  locationId?: string;
  ward?: string;
  metadata?: Record<string, unknown>;
  detectedAt: string;
  resolvedAt?: string;
  createdAt: string;
}

// ============================================================
// ACTIONS
// ============================================================

export interface Action {
  id: string;
  module: Module;
  title: string;
  description: string;
  priority: Priority;
  status: ActionStatus;
  locationId?: string;
  ward?: string;
  eventId?: string;
  reason?: string;
  recommendedAction?: string;
  assignedDept?: string;
  assignedToId?: string;
  assignedTo?: User;
  createdById?: string;
  dueAt?: string;
  resolvedAt?: string;
  aiGenerated: boolean;
  aiApproved?: boolean;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// CITIZEN REPORTS
// ============================================================

export interface CitizenReport {
  id: string;
  submittedById?: string;
  category: ReportCategory;
  title: string;
  description: string;
  locationId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  ward?: string;
  severity?: Priority;
  aiCategory?: string;
  aiSummary?: string;
  aiDepartment?: string;
  aiConfidence?: number;
  aiFactors?: PriorityFactor[];
  status: ActionStatus;
  isAnonymous: boolean;
  media?: ReportMedia[];
  createdAt: string;
}

export interface ReportMedia {
  id: string;
  reportId: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  description?: string;
  createdAt: string;
}

// ============================================================
// ASSETS / INFRASTRUCTURE
// ============================================================

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  locationId: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  ward?: string;
  department?: string;
  capacity?: number;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
}

// ============================================================
// RISK ASSESSMENT
// ============================================================

export interface RiskAssessment {
  id: string;
  module: Module;
  eventId?: string;
  assetId?: string;
  locationId?: string;
  ward?: string;
  priority: Priority;
  priorityScore: number;
  populationAffected?: number;
  reportCount: number;
  recurrenceCount?: number;
  factors: PriorityFactor[];
  aiExplanation?: string;
  aiConfidence?: number;
  aiProvider?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// ============================================================
// MISSIONS
// ============================================================

export interface Mission {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  status: MissionStatus;
  priority: Priority;
  locationId?: string;
  ward?: string;
  startedAt: string;
  resolvedAt?: string;
  createdById?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export interface Notification {
  id: string;
  profileId: string;
  type: NotificationType;
  title: string;
  message: string;
  module?: Module;
  actionId?: string;
  missionId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ============================================================
// AI PROVIDER
// ============================================================

export type AIProvider = "openai" | "gemini" | "openrouter" | "groq" | "rule-based";

export type AITask =
  | "classify"
  | "summarize"
  | "analyze_image"
  | "extract_entities"
  | "generate_structured"
  | "explain_priority"
  | "recommend_action";

export interface AIResult<T = unknown> {
  data: T;
  provider: AIProvider;
  model: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  cacheHit: boolean;
  fallbackUsed: boolean;
}

export interface AIProviderHealth {
  provider: AIProvider;
  isOperational: boolean;
  successRate: number;
  avgLatencyMs?: number;
  failureCount: number;
  lastFailureAt?: string;
  cooldownUntil?: string;
  totalRequests: number;
}

// ============================================================
// REPORT ANALYSIS (structured AI output)
// ============================================================

export interface ReportAnalysisOutput {
  category: ReportCategory;
  severity: Priority;
  summary: string;
  department: string;
  confidence: number;
  recommendedAction: string;
  factors: string[];
  entities: {
    location?: string;
    infrastructure?: string;
    problem?: string;
  };
}

// ============================================================
// MAP / GIS
// ============================================================

export interface MapLayer {
  id: string;
  name: string;
  module: Module;
  isVisible: boolean;
  type: "markers" | "heatmap" | "polygon" | "route";
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: AssetType | ReportCategory | "risk" | "action" | "mission";
  priority?: Priority;
  title: string;
  description?: string;
  module?: Module;
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export interface DashboardStats {
  criticalIssues: number;
  highPriorityIssues: number;
  activeRisks: number;
  pendingActions: number;
  resolvedToday: number;
  activeMissions: number;
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================
// FILTER / SEARCH
// ============================================================

export interface ActionFilter {
  module?: Module;
  priority?: Priority;
  status?: ActionStatus;
  ward?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
