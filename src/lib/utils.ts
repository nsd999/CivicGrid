// CivicGrid — Utility functions

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Priority, ActionStatus, Module } from "@/types";

// ============================================================
// TAILWIND CLASS MERGING
// ============================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// PRIORITY STYLES
// ============================================================

export function getPriorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-100 text-red-800 border-red-200";
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
  }
}

export function getPriorityDotClass(priority: Priority): string {
  switch (priority) {
    case "CRITICAL": return "bg-red-500";
    case "HIGH": return "bg-orange-500";
    case "MEDIUM": return "bg-amber-500";
    case "LOW": return "bg-green-500";
  }
}

export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case "CRITICAL": return "Critical";
    case "HIGH": return "High";
    case "MEDIUM": return "Medium";
    case "LOW": return "Low";
  }
}

// ============================================================
// STATUS STYLES
// ============================================================

export function getStatusBadgeClass(status: ActionStatus): string {
  switch (status) {
    case "NEW": return "bg-blue-100 text-blue-800 border-blue-200";
    case "REVIEWING": return "bg-purple-100 text-purple-800 border-purple-200";
    case "ASSIGNED": return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "IN_PROGRESS": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "BLOCKED": return "bg-red-100 text-red-800 border-red-200";
    case "RESOLVED": return "bg-green-100 text-green-800 border-green-200";
    case "VERIFIED": return "bg-teal-100 text-teal-800 border-teal-200";
    case "CLOSED": return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getStatusLabel(status: ActionStatus): string {
  switch (status) {
    case "NEW": return "New";
    case "REVIEWING": return "Reviewing";
    case "ASSIGNED": return "Assigned";
    case "IN_PROGRESS": return "In Progress";
    case "BLOCKED": return "Blocked";
    case "RESOLVED": return "Resolved";
    case "VERIFIED": return "Verified";
    case "CLOSED": return "Closed";
  }
}

// ============================================================
// MODULE LABELS
// ============================================================

export function getModuleLabel(module: Module): string {
  switch (module) {
    case "CIVICGRID_CORE": return "CivicGrid";
    case "SWASTHYAGRID": return "SwasthyaGrid";
    case "SURAKSHAGRID": return "SurakshaGrid";
    case "MONSOONSHIELD": return "MonsoonShield";
    case "HEATSAFE_INDIA": return "HeatSafe India";
    case "SYSTEM": return "System";
  }
}

export function getModuleColor(module: Module): string {
  switch (module) {
    case "CIVICGRID_CORE": return "text-blue-700 bg-blue-50";
    case "SWASTHYAGRID": return "text-green-700 bg-green-50";
    case "SURAKSHAGRID": return "text-red-700 bg-red-50";
    case "MONSOONSHIELD": return "text-cyan-700 bg-cyan-50";
    case "HEATSAFE_INDIA": return "text-orange-700 bg-orange-50";
    case "SYSTEM": return "text-gray-700 bg-gray-50";
  }
}

export function getModuleAccent(module: Module): string {
  switch (module) {
    case "CIVICGRID_CORE": return "#1e40af";    // blue-800
    case "SWASTHYAGRID": return "#15803d";      // green-700
    case "SURAKSHAGRID": return "#b91c1c";      // red-700
    case "MONSOONSHIELD": return "#0e7490";     // cyan-700
    case "HEATSAFE_INDIA": return "#c2410c";    // orange-700
    case "SYSTEM": return "#374151";            // gray-700
  }
}

// ============================================================
// DATE FORMATTING
// ============================================================

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

// ============================================================
// NUMBERS
// ============================================================

export function formatNumber(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatPercent(n: number, decimals = 0): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

// ============================================================
// TRUNCATION
// ============================================================

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

// ============================================================
// DEMO MODE
// ============================================================

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
