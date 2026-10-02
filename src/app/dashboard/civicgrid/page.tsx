import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { PriorityBadge, StatusBadge, SectionHeader, AIIndicator, StatCard } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { Building2, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "CivicGrid Core — Public Infrastructure" };

export default async function CivicGridCorePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [reports, coreActions, coreRisks] = await Promise.all([
    prisma.citizenReport.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.action.findMany({ where: { module: "CIVICGRID_CORE" }, orderBy: { createdAt: "desc" } }),
    prisma.riskAssessment.findMany({ where: { module: "CIVICGRID_CORE" } })
  ]);

  const categoryStats = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Building2 size={24} color="#1d4ed8" />
          <div>
            <h1 style={{ margin: 0, color: "#1d4ed8" }}>CivicGrid Core</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Public infrastructure intelligence · Hyderabad District
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="Total Reports" value={reports.length} color="#1d4ed8" />
          <StatCard label="Active Actions" value={coreActions.length} color="#c2410c" />
          <StatCard
            label="Resolved Today"
            value={coreActions.filter((a) => a.status === "RESOLVED" || a.status === "VERIFIED" || a.status === "CLOSED").length}
            color="#15803d"
          />
          <StatCard label="SLA Breached" value={coreActions.filter(a => a.slaBreached).length} color="#b91c1c" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Recent Reports */}
          <div>
            <SectionHeader
              title="Citizen Reports"
              count={reports.length}
              action={
                <Link
                  href="/dashboard/civicgrid/report"
                  style={{ fontSize: "0.8125rem", color: "#1d4ed8", textDecoration: "none", fontWeight: 500 }}
                >
                  + Submit Report
                </Link>
              }
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reports.map((report) => (
                <div key={report.id} className="card" style={{ padding: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {report.severity && <PriorityBadge priority={report.severity} />}
                      <StatusBadge status={report.status} />
                      {report.aiConfidence !== undefined && report.aiConfidence !== null && (
                        <AIIndicator confidence={report.aiConfidence as number} />
                      )}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {formatRelativeTime(report.createdAt.toISOString())}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                    {report.title}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 4 }}>
                    {report.description.slice(0, 100)}...
                  </div>
                  {report.aiSummary && (
                    <div style={{
                      marginTop: 8,
                      padding: "6px 10px",
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
                      borderRadius: 5,
                      fontSize: "0.75rem",
                      color: "#1d4ed8",
                    }}>
                      ✦ AI: {report.aiSummary}
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#94a3b8" }}>
                    📍 {report.ward} · {report.address}
                    {report.isAnonymous ? " · Anonymous" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown + Active Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Category breakdown */}
            <div>
              <SectionHeader title="Reports by Category" />
              <div className="card">
                {Object.entries(categoryStats).map(([cat, count]) => (
                  <div key={cat} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                    <span style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 }}>
                      {cat.replace(/_/g, " ")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 60,
                        height: 6,
                        background: "#f1f5f9",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${reports.length > 0 ? (count / reports.length) * 100 : 0}%`,
                          height: "100%",
                          background: "#1d4ed8",
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1d4ed8", minWidth: 16 }}>
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Actions */}
            <div>
              <SectionHeader title="Active Actions" count={coreActions.length} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {coreActions.map((action) => (
                  <div key={action.id} className="card" style={{
                    padding: "0.875rem",
                    borderLeft: `3px solid ${action.priority === "CRITICAL" ? "#b91c1c" : action.priority === "HIGH" ? "#c2410c" : "#b45309"}`,
                  }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <PriorityBadge priority={action.priority} />
                      <StatusBadge status={action.status} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                      {action.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 4 }}>
                      {action.assignedDept} · {action.ward}
                    </div>
                    {action.recommendedAction && (
                      <div style={{ fontSize: "0.75rem", color: "#15803d", marginTop: 6, fontStyle: "italic" }}>
                        → {action.recommendedAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
