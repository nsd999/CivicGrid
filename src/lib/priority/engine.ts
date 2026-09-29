// CivicGrid — Priority Engine
// Deterministic scoring — never opaque AI-only numbers

import type { Priority, PriorityFactor, PriorityResult } from "@/types";

// ============================================================
// SCORING CONFIGURATION
// ============================================================

interface PriorityWeights {
  populationAffected: number;
  criticalFacilityProximity: number;
  reportCount: number;
  recurrence: number;
  severity: number;
  riskExposure: number;
  daysUnresolved: number;
  geoConcentration: number;
}

const DEFAULT_WEIGHTS: PriorityWeights = {
  populationAffected: 0.25,
  criticalFacilityProximity: 0.20,
  reportCount: 0.15,
  recurrence: 0.10,
  severity: 0.15,
  riskExposure: 0.05,
  daysUnresolved: 0.05,
  geoConcentration: 0.05,
};

// Priority thresholds (0–100 score)
const PRIORITY_THRESHOLDS = {
  CRITICAL: 75,
  HIGH: 50,
  MEDIUM: 25,
  LOW: 0,
};

// ============================================================
// INPUT TYPES
// ============================================================

export interface PriorityInput {
  populationAffected?: number;         // raw number of people
  criticalFacilityProximityM?: number; // distance in meters to nearest hospital/school
  hasCriticalFacility?: boolean;       // shortcut flag
  reportCount?: number;                // total correlated reports
  recurrenceCount?: number;            // times same issue recurred
  severityRaw?: string;                // "CRITICAL"|"HIGH"|"MEDIUM"|"LOW"
  riskExposureCategories?: string[];   // e.g. ["flood", "heat"]
  daysUnresolved?: number;
  geoConcentration?: number;           // 0–1, reports per km²
  nearbyFacilities?: Array<{
    type: string;
    name: string;
    distanceM: number;
  }>;
}

// ============================================================
// NORMALIZERS — map raw values to 0–100 signals
// ============================================================

function normalizePopulation(n: number | undefined): number {
  if (!n) return 0;
  if (n >= 10000) return 100;
  if (n >= 5000) return 80;
  if (n >= 1000) return 60;
  if (n >= 500) return 40;
  if (n >= 100) return 20;
  return 10;
}

function normalizeFacilityProximity(
  distanceM: number | undefined,
  hasFacility: boolean | undefined
): { score: number; label: string } {
  if (hasFacility || (distanceM !== undefined && distanceM <= 200)) {
    return { score: 100, label: "Critical facility within 200m" };
  }
  if (distanceM !== undefined) {
    if (distanceM <= 500) return { score: 80, label: `Critical facility within 500m` };
    if (distanceM <= 1000) return { score: 60, label: `Critical facility within 1km` };
    if (distanceM <= 2000) return { score: 40, label: `Critical facility within 2km` };
    return { score: 20, label: `Critical facility at ${Math.round(distanceM / 1000)}km` };
  }
  return { score: 0, label: "No critical facility nearby" };
}

function normalizeReportCount(n: number | undefined): number {
  if (!n) return 0;
  if (n >= 50) return 100;
  if (n >= 20) return 75;
  if (n >= 10) return 55;
  if (n >= 5) return 35;
  if (n >= 2) return 20;
  return 10;
}

function normalizeRecurrence(n: number | undefined): number {
  if (!n) return 0;
  if (n >= 10) return 100;
  if (n >= 5) return 70;
  if (n >= 3) return 50;
  if (n >= 2) return 30;
  return 10;
}

function normalizeSeverity(raw: string | undefined): number {
  switch (raw) {
    case "CRITICAL": return 100;
    case "HIGH": return 75;
    case "MEDIUM": return 50;
    case "LOW": return 25;
    default: return 30;
  }
}

function normalizeRiskExposure(categories: string[] | undefined): number {
  if (!categories || categories.length === 0) return 0;
  return Math.min(categories.length * 25, 100);
}

function normalizeDaysUnresolved(days: number | undefined): number {
  if (!days) return 0;
  if (days >= 30) return 100;
  if (days >= 14) return 70;
  if (days >= 7) return 50;
  if (days >= 3) return 30;
  return 10;
}

function normalizeGeoConcentration(v: number | undefined): number {
  if (!v) return 0;
  return Math.min(v * 100, 100);
}

// ============================================================
// MAIN ENGINE
// ============================================================

export function computePriority(
  input: PriorityInput,
  weights: Partial<PriorityWeights> = {}
): PriorityResult {
  const w = { ...DEFAULT_WEIGHTS, ...weights };

  // Normalize each signal to 0–100
  const facilityResult = normalizeFacilityProximity(
    input.criticalFacilityProximityM,
    input.hasCriticalFacility
  );

  const signals = {
    populationAffected: normalizePopulation(input.populationAffected),
    criticalFacilityProximity: facilityResult.score,
    reportCount: normalizeReportCount(input.reportCount),
    recurrence: normalizeRecurrence(input.recurrenceCount),
    severity: normalizeSeverity(input.severityRaw),
    riskExposure: normalizeRiskExposure(input.riskExposureCategories),
    daysUnresolved: normalizeDaysUnresolved(input.daysUnresolved),
    geoConcentration: normalizeGeoConcentration(input.geoConcentration),
  };

  // Weighted sum → 0–100
  const score =
    signals.populationAffected * w.populationAffected +
    signals.criticalFacilityProximity * w.criticalFacilityProximity +
    signals.reportCount * w.reportCount +
    signals.recurrence * w.recurrence +
    signals.severity * w.severity +
    signals.riskExposure * w.riskExposure +
    signals.daysUnresolved * w.daysUnresolved +
    signals.geoConcentration * w.geoConcentration;

  // Determine priority tier
  let priority: Priority;
  if (score >= PRIORITY_THRESHOLDS.CRITICAL) priority = "CRITICAL";
  else if (score >= PRIORITY_THRESHOLDS.HIGH) priority = "HIGH";
  else if (score >= PRIORITY_THRESHOLDS.MEDIUM) priority = "MEDIUM";
  else priority = "LOW";

  // Build transparent factor list
  const factors: PriorityFactor[] = [
    {
      factor: "population_affected",
      label: `Population affected: ${input.populationAffected?.toLocaleString() ?? "unknown"}`,
      value: input.populationAffected ?? 0,
      weight: w.populationAffected,
      contribution: signals.populationAffected * w.populationAffected,
    },
    {
      factor: "critical_facility_proximity",
      label: facilityResult.label,
      value: input.criticalFacilityProximityM ?? "N/A",
      weight: w.criticalFacilityProximity,
      contribution: signals.criticalFacilityProximity * w.criticalFacilityProximity,
    },
    {
      factor: "report_count",
      label: `${input.reportCount ?? 0} correlated reports`,
      value: input.reportCount ?? 0,
      weight: w.reportCount,
      contribution: signals.reportCount * w.reportCount,
    },
    {
      factor: "recurrence",
      label: `Issue recurred ${input.recurrenceCount ?? 0} times`,
      value: input.recurrenceCount ?? 0,
      weight: w.recurrence,
      contribution: signals.recurrence * w.recurrence,
    },
    {
      factor: "severity",
      label: `Reported severity: ${input.severityRaw ?? "MEDIUM"}`,
      value: input.severityRaw ?? "MEDIUM",
      weight: w.severity,
      contribution: signals.severity * w.severity,
    },
    {
      factor: "risk_exposure",
      label:
        input.riskExposureCategories?.length
          ? `Risk categories: ${input.riskExposureCategories.join(", ")}`
          : "No additional risk exposure",
      value: input.riskExposureCategories?.join(", ") ?? "none",
      weight: w.riskExposure,
      contribution: signals.riskExposure * w.riskExposure,
    },
    {
      factor: "days_unresolved",
      label: `Unresolved for ${input.daysUnresolved ?? 0} days`,
      value: input.daysUnresolved ?? 0,
      weight: w.daysUnresolved,
      contribution: signals.daysUnresolved * w.daysUnresolved,
    },
  ].filter((f) => f.contribution > 0);

  // Sort by contribution (highest first)
  factors.sort((a, b) => b.contribution - a.contribution);

  return {
    priority,
    score: Math.round(score * 10) / 10,
    factors,
    computedAt: new Date().toISOString(),
  };
}

// ============================================================
// HELPERS
// ============================================================

export function priorityToColor(p: Priority): string {
  switch (p) {
    case "CRITICAL": return "red";
    case "HIGH": return "orange";
    case "MEDIUM": return "yellow";
    case "LOW": return "green";
  }
}

export function priorityToNumber(p: Priority): number {
  switch (p) {
    case "CRITICAL": return 4;
    case "HIGH": return 3;
    case "MEDIUM": return 2;
    case "LOW": return 1;
  }
}

export function sortByPriority<T extends { priority: Priority }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => priorityToNumber(b.priority) - priorityToNumber(a.priority)
  );
}
