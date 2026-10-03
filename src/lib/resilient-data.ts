import prisma from "@/lib/db";
import {
  DEMO_ACTIONS,
  DEMO_ASSETS,
  DEMO_EVENTS,
  DEMO_MISSIONS,
  DEMO_NOTIFICATIONS,
  DEMO_REPORTS,
  DEMO_RISKS,
  DEMO_HEALTH_INVENTORY,
} from "@/data/demo";

export type DataMode = "DATABASE" | "DEMO_FALLBACK";

function date(value: string | Date | undefined | null) {
  return value ? new Date(value) : null;
}

export const DEMO_DB = {
  actions: DEMO_ACTIONS.map((a) => ({
    ...a,
    eventId: a.eventId ?? undefined,
    createdAt: new Date(a.createdAt),
    updatedAt: new Date(a.updatedAt),
    dueAt: date(a.dueAt),
    resolvedAt: date(a.resolvedAt),
  })),
  reports: DEMO_REPORTS.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
  })),
  assets: DEMO_ASSETS.map((a) => ({
    ...a,
    createdAt: new Date(a.createdAt),
  })),
  events: DEMO_EVENTS.map((e) => ({
    ...e,
    detectedAt: new Date(e.detectedAt),
    createdAt: new Date(e.createdAt),
    resolvedAt: date(e.resolvedAt),
  })),
  risks: DEMO_RISKS.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.createdAt),
    recurrenceCount: r.recurrenceCount ?? 0,
    factors: r.factors ?? [],
    aiExplanation: r.aiExplanation,
    aiConfidence: r.aiConfidence,
    aiProvider: r.aiProvider,
    asset:
      r.assetId
        ? DEMO_ASSETS.find((asset) => asset.id === r.assetId) ?? null
        : null,
  })),
  missions: DEMO_MISSIONS.map((m) => ({
    ...m,
    startedAt: new Date(m.startedAt),
    createdAt: new Date(m.createdAt),
    resolvedAt: date(m.resolvedAt),
    metadata: m.metadata ?? {},
  })),
  notifications: DEMO_NOTIFICATIONS.map((n) => ({
    ...n,
    createdAt: new Date(n.createdAt),
    readAt: date(n.readAt),
  })),
  healthInventory: DEMO_HEALTH_INVENTORY,
};

async function dbOr<T>(
  query: () => Promise<T>,
  fallback: any,
  label: string,
): Promise<{ data: T; mode: DataMode }> {
  try {
    return { data: await query(), mode: "DATABASE" };
  } catch (error) {
    console.warn("[CivicGrid] Database unavailable; using demo fallback for", label, error);
    return { data: fallback as T, mode: "DEMO_FALLBACK" };
  }
}

export async function getActions(options: {
  where?: any;
  orderBy?: any;
} = {}) {
  return dbOr(
    () => prisma.action.findMany(options),
    options.where?.module
      ? DEMO_DB.actions.filter((a) => a.module === options.where.module)
      : DEMO_DB.actions,
    "actions",
  );
}

export async function getRisks(options: {
  where?: any;
  orderBy?: any;
  include?: any;
} = {}) {
  let fallback = [...DEMO_DB.risks];
  if (options.where?.module) fallback = fallback.filter((r) => r.module === options.where.module);
  return dbOr(
    () => prisma.riskAssessment.findMany(options),
    fallback,
    "risk assessments",
  );
}

export async function getEvents(options: { orderBy?: any } = {}) {
  return dbOr(
    () => prisma.event.findMany(options),
    [...DEMO_DB.events],
    "events",
  );
}

export async function getMissions(options: {
  where?: any;
  orderBy?: any;
  take?: number;
} = {}) {
  let fallback = [...DEMO_DB.missions];
  if (options.where?.status) fallback = fallback.filter((m) => m.status === options.where.status);
  if (options.take) fallback = fallback.slice(0, options.take);
  return dbOr(
    () => prisma.mission.findMany(options),
    fallback,
    "missions",
  );
}

export async function getReports(options: { orderBy?: any } = {}) {
  return dbOr(
    () => prisma.citizenReport.findMany(options),
    [...DEMO_DB.reports],
    "citizen reports",
  );
}

export async function getAssets(options: { where?: any; select?: any } = {}) {
  let fallback = [...DEMO_DB.assets];
  if (options.where?.type) fallback = fallback.filter((a) => a.type === options.where.type);
  if (options.where?.isActive !== undefined) fallback = fallback.filter((a) => a.isActive === options.where.isActive);
  return dbOr(
    () => prisma.asset.findMany(options),
    fallback,
    "assets",
  );
}

export async function getNotifications(profileId: string) {
  return dbOr(
    () =>
      prisma.notification.findMany({
        where: { profileId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    DEMO_DB.notifications.filter((n) => n.profileId === profileId),
    "notifications",
  );
}

export async function getUnreadNotificationCount(profileId: string) {
  return dbOr(
    () => prisma.notification.count({ where: { profileId, isRead: false } }),
    DEMO_DB.notifications.filter((n) => n.profileId === profileId && !n.isRead).length,
    "notification count",
  );
}

export async function getDashboardData() {
  const [actionsResult, risksResult, eventsResult, missionsResult] = await Promise.all([
    getActions(),
    getRisks({ orderBy: { priorityScore: "desc" } }),
    getEvents({ orderBy: { detectedAt: "desc" } }),
    getMissions({ orderBy: { startedAt: "desc" }, take: 1 }),
  ]);

  const actions = actionsResult.data;
  const criticalCount = actions.filter((a: any) => a.priority === "CRITICAL" && a.status !== "RESOLVED").length;
  const highCount = actions.filter((a: any) => a.priority === "HIGH" && a.status !== "RESOLVED").length;
  const pendingCount = actions.filter((a: any) => a.status === "ASSIGNED").length;
  const resolvedTodayCount = actions.filter((a: any) => ["RESOLVED", "VERIFIED", "CLOSED"].includes(a.status)).length;

  return {
    actions,
    risks: risksResult.data,
    events: eventsResult.data,
    missions: missionsResult.data,
    criticalCount,
    highCount,
    pendingCount,
    resolvedTodayCount,
    mode:
      [actionsResult.mode, risksResult.mode, eventsResult.mode, missionsResult.mode].includes("DEMO_FALLBACK")
        ? "DEMO_FALLBACK"
        : "DATABASE",
  } as const;
}
