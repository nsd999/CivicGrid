import { getDashboardData } from "@/lib/resilient-data";
import {
  PriorityBadge,
  StatusBadge,
  ModuleBadge,
  StatCard,
  SectionHeader,
  AIIndicator,
} from "@/components/ui";
import { getModuleLabel, formatRelativeTime } from "@/lib/utils";
import {
  AlertTriangle,
  Zap,
  Shield,
  CheckCircle,
  Activity,
  ArrowRight,
  Flag,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Home — CivicGrid",
};

export default async function DashboardPage() {

  const {
    actions,
    risks,
    events,
    missions,
    criticalCount,
    highCount,
    pendingCount,
    resolvedTodayCount,
    mode,
  } = await getDashboardData();

  const activeMission = missions[0];
  const displayName = "Administrator";

  // Today's priorities — top 5 by priority
  const todaysPriorities = [...actions]
    .filter(a => a.status !== "RESOLVED")
    .sort((a, b) => {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return order[b.priority] - order[a.priority];
    })
    .slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
              Good morning, {displayName} 👋
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · Hyderabad District
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              fontSize: "0.75rem",
              color: "#15803d",
              background: "#dcfce7",
              padding: "4px 10px",
              borderRadius: 4,
              fontWeight: 600,
              border: "1px solid #bbf7d0",
            }}>
              ● "+(mode === "DATABASE" ? "Live Data Connected" : "Demo Data Fallback")+"
            </span>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Active Mission Alert */}
        {activeMission && (
          <Link href="/dashboard/missions" style={{ textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
            <div style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderLeft: "4px solid #c2410c",
              borderRadius: 8,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Flag size={20} color="#c2410c" />
                <div>
                  <div style={{ fontWeight: 700, color: "#9a3412", fontSize: "0.9375rem" }}>
                    🚨 MISSION ACTIVE: {activeMission.title}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#c2410c", marginTop: 2 }}>
                    {(activeMission.metadata as Record<string, unknown>)?.critical_actions as number} critical ·{" "}
                    {(activeMission.metadata as Record<string, unknown>)?.high_actions as number} high priority ·{" "}
                    {Array.isArray((activeMission.metadata as Record<string, unknown>)?.departments)
                      ? ((activeMission.metadata as Record<string, unknown>)?.departments as string[]).length
                      : 0} departments coordinating
                  </div>
                </div>
              </div>
              <ArrowRight size={20} color="#c2410c" />
            </div>
          </Link>
        )}

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          <StatCard
            label="Critical Issues"
            value={criticalCount}
            icon={<AlertTriangle size={22} />}
            color="#b91c1c"
          />
          <StatCard
            label="High Priority"
            value={highCount}
            icon={<Zap size={22} />}
            color="#c2410c"
          />
          <StatCard
            label="Active Risks"
            value={risks.length}
            icon={<Shield size={22} />}
            color="#b45309"
          />
          <StatCard
            label="Pending Actions"
            value={pendingCount}
            icon={<Activity size={22} />}
            color="#1d4ed8"
          />
          <StatCard
            label="Resolved Today"
            value={resolvedTodayCount}
            icon={<CheckCircle size={22} />}
            color="#15803d"
          />
        </div>

        {/* Traceability strip */}
        <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem 1.1rem", background: "#f8fbff", borderColor: "#dbeafe" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: ".7rem", color: "#1d4ed8", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" }}>
                Traceable civic response loop
              </div>
              <div style={{ marginTop: 3, fontSize: ".82rem", color: "#475569" }}>
                Every operational item is designed to move from signal → evidence → risk → decision → action → verification.
              </div>
            </div>
            <Link href="/dashboard/analytics" className="btn btn-secondary btn-sm" style={{ color: "#1d4ed8" }}>
              Inspect provenance <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 6, marginTop: 12 }}>
            {[
              ["Signal", events.length],
              ["Evidence", actions.filter((a) => a.eventId).length],
              ["Risk", risks.length],
              ["Decision", actions.filter((a) => a.aiGenerated).length],
              ["Action", actions.filter((a) => a.status !== "NEW").length],
              ["Verified", actions.filter((a) => ["VERIFIED", "CLOSED"].includes(a.status)).length],
            ].map(([label, value], i) => (
              <div key={label} style={{ padding: "8px 9px", borderRadius: 7, background: "white", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: ".68rem", color: "#94a3b8", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#334155", marginTop: 2 }}>{label}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Today's Priorities */}
          <div>
            <SectionHeader
              title="Today's Priorities"
              description="What needs attention right now"
              count={todaysPriorities.length}
              action={
                <Link
                  href="/dashboard/action-centre"
                  style={{
                    fontSize: "0.8125rem",
                    color: "#1d4ed8",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontWeight: 500,
                  }}
                >
                  View all <ArrowRight size={14} />
                </Link>
              }
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {todaysPriorities.map((action) => (
                <Link
                  key={action.id}
                  href={`/dashboard/action-centre?id=${action.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card"
                    style={{
                      padding: "1rem",
                      borderLeft: `3px solid ${
                        action.priority === "CRITICAL"
                          ? "#b91c1c"
                          : action.priority === "HIGH"
                          ? "#c2410c"
                          : action.priority === "MEDIUM"
                          ? "#b45309"
                          : "#15803d"
                      }`,
                      transition: "box-shadow 120ms",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                          <PriorityBadge priority={action.priority} />
                          <ModuleBadge module={action.module} />
                          <StatusBadge status={action.status} />
                          {action.aiGenerated && (
                            <AIIndicator confidence={undefined} />
                          )}
                        </div>
                        <div style={{
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "#0f172a",
                          marginBottom: 4,
                        }}>
                          {action.title}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: 6 }}>
                          {action.reason}
                        </div>
                        <div style={{
                          fontSize: "0.8125rem",
                          background: "#f0fdf4",
                          color: "#15803d",
                          padding: "6px 10px",
                          borderRadius: 5,
                          border: "1px solid #dcfce7",
                        }}>
                          <span style={{ fontWeight: 600 }}>→ Recommended: </span>
                          {action.recommendedAction}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                    }}>
                      <span>📍 {action.ward} · {action.assignedDept}</span>
                      {action.slaBreached && (
                        <span style={{
                          color: "#b91c1c",
                          fontWeight: 600,
                          background: "#fee2e2",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}>
                          ⚠ SLA Breached
                        </span>
                      )}
                      <span>{formatRelativeTime(action.createdAt.toISOString())}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Active Risks */}
            <div>
              <SectionHeader
                title="Active Risks"
                count={risks.length}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {risks.slice(0, 5).map((risk) => (
                  <div key={risk.id} className="card" style={{ padding: "0.875rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <PriorityBadge priority={risk.priority} />
                          <ModuleBadge module={risk.module} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                          {risk.ward}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 2 }}>
                          Score: {risk.priorityScore}/100 ·{" "}
                          {risk.populationAffected?.toLocaleString()} affected
                        </div>
                      </div>
                    </div>
                    {risk.aiExplanation && (
                      <div style={{
                        marginTop: 8,
                        fontSize: "0.8125rem",
                        color: "#475569",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: 8,
                      }}>
                        {risk.aiExplanation.slice(0, 120)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <SectionHeader title="Recent Events" count={events.length} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {events.slice(0, 4).map((event) => (
                  <div key={event.id} className="card" style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <PriorityBadge priority={event.severity} />
                      <ModuleBadge module={event.module} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0f172a" }}>
                      {event.title}
                    </div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginTop: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                      <span>{event.source.replace(/_/g, " ")}</span>
                      <span>{formatRelativeTime(event.detectedAt.toISOString())}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", marginBottom: 10 }}>
                Quick Actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Submit Citizen Report", href: "/dashboard/civicgrid/report", icon: "📝" },
                  { label: "View District Map", href: "/dashboard/map", icon: "🗺️" },
                  { label: "Mission Control", href: "/dashboard/missions", icon: "🚨" },
                  { label: "AI Provider Health", href: "/dashboard/admin/ai-health", icon: "⚙️" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: "0.875rem",
                      color: "#1d4ed8",
                      textDecoration: "none",
                      transition: "background 100ms",
                    }}
                    className="nav-item"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                    <ArrowRight size={14} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
