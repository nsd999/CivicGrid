import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import {
  PriorityBadge,
  StatusBadge,
  ModuleBadge,
  SectionHeader,
  AIIndicator,
  EmptyState,
} from "@/components/ui";
import { formatRelativeTime, formatDateTime } from "@/lib/utils";
import { Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ActionClientTable } from "./action-client";
import type { Priority, ActionStatus, Module } from "@/types";

export const metadata = {
  title: "Action Centre — CivicGrid",
};

const PRIORITIES: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default async function ActionCentrePage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string; module?: string; status?: string; dept?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "CITIZEN") redirect("/dashboard");

  const params = await searchParams;
  const filterPriority = params.priority as Priority | undefined;
  const filterModule = params.module as Module | undefined;
  const filterStatus = params.status as ActionStatus | undefined;
  const filterDept = params.dept;

  const baseWhere =
    session.user.role === "FIELD_WORKER"
      ? { assignedToId: session.user.id }
      : session.user.role === "DEPARTMENT_OFFICER"
        ? { assignedDept: session.user.department ?? "__NONE__" }
        : {};

  const allActions = await prisma.action.findMany({ where: baseWhere });
  let actions = [...allActions];

  // Apply filters
  if (filterPriority) {
    actions = actions.filter((a) => a.priority === filterPriority);
  }
  if (filterModule) {
    actions = actions.filter((a) => a.module === filterModule);
  }
  if (filterStatus) {
    actions = actions.filter((a) => a.status === filterStatus);
  }
  if (filterDept) {
    actions = actions.filter((a) => a.assignedDept === filterDept);
  }

  // Sort by priority then date
  const priorityOrder: Record<Priority, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  actions.sort((a, b) => {
    const pd = priorityOrder[b.priority as Priority] - priorityOrder[a.priority as Priority];
    if (pd !== 0) return pd;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const grouped = PRIORITIES.map((priority) => ({
    priority,
    actions: actions.filter((a) => a.priority === priority),
  })).filter((g) => g.actions.length > 0);

  const departments = [...new Set(allActions.map((a) => a.assignedDept).filter(Boolean))];
  const modules = [...new Set(allActions.map((a) => a.module))];
  const statuses: ActionStatus[] = ["NEW", "REVIEWING", "ASSIGNED", "IN_PROGRESS", "BLOCKED", "RESOLVED"];

  const criticalCount = allActions.filter((a) => a.priority === "CRITICAL").length;
  const pendingApproval = allActions.filter((a) => a.aiGenerated && a.aiApproved === false).length;
  const slaBreached = allActions.filter((a) => a.slaBreached).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={22} />
              Action Centre
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Unified operational intelligence — {actions.length} actions
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {criticalCount > 0 && (
              <span style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid #fecaca",
              }}>
                🔴 {criticalCount} Critical
              </span>
            )}
            {pendingApproval > 0 && (
              <span style={{
                background: "#eef2ff",
                color: "#4338ca",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid #e0e7ff",
              }}>
                ✦ {pendingApproval} Awaiting AI Approval
              </span>
            )}
            {slaBreached > 0 && (
              <span style={{
                background: "#fff7ed",
                color: "#c2410c",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid #fed7aa",
              }}>
                ⚠ {slaBreached} SLA Breached
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="card" style={{ marginBottom: "1.5rem", padding: "0.875rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#64748b" }}>Filter:</span>

            {/* Priority filter */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["ALL", ...PRIORITIES] as string[]).map((p) => (
                <Link
                  key={p}
                  href={p === "ALL" ? "/dashboard/action-centre" : `?priority=${p}${filterModule ? `&module=${filterModule}` : ""}${filterStatus ? `&status=${filterStatus}` : ""}`}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid",
                    textDecoration: "none",
                    background: filterPriority === p || (!filterPriority && p === "ALL") ? "#0f172a" : "white",
                    color: filterPriority === p || (!filterPriority && p === "ALL") ? "white" : "#475569",
                    borderColor: filterPriority === p || (!filterPriority && p === "ALL") ? "#0f172a" : "#d1d5db",
                  }}
                >
                  {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
                </Link>
              ))}
            </div>

            <div style={{ width: 1, height: 24, background: "#e2e8f0" }} />

            {/* Department filter */}
            <select
              className="select"
              style={{ width: "auto", fontSize: "0.8125rem", padding: "4px 8px" }}
              value={filterDept ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set("dept", e.target.value);
                else url.searchParams.delete("dept");
                window.location.href = url.toString();
              }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d as string} value={d! as string}>{d as string}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              className="select"
              style={{ width: "auto", fontSize: "0.8125rem", padding: "4px 8px" }}
              value={filterStatus ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set("status", e.target.value);
                else url.searchParams.delete("status");
                window.location.href = url.toString();
              }}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>

            {/* Clear filters */}
            {(filterPriority || filterModule || filterStatus || filterDept) && (
              <Link
                href="/dashboard/action-centre"
                style={{ fontSize: "0.8125rem", color: "#1d4ed8", textDecoration: "none" }}
              >
                Clear filters
              </Link>
            )}
          </div>
        </div>

        {/* Actions grouped by priority */}
        {actions.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle size={48} />}
            title="No actions found"
            description="Try adjusting your filters or check back later."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {grouped.map(({ priority, actions: grpActions }) => (
              <div key={priority}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "0.875rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "2px solid",
                  borderColor:
                    priority === "CRITICAL" ? "#b91c1c"
                    : priority === "HIGH" ? "#c2410c"
                    : priority === "MEDIUM" ? "#b45309"
                    : "#15803d",
                }}>
                  <PriorityBadge priority={priority} />
                  <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                    {grpActions.length} action{grpActions.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <ActionClientTable initialActions={grpActions as any} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
