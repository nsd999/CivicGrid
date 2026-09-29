import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { PriorityBadge, StatusBadge, ModuleBadge, SectionHeader } from "@/components/ui";
import { Flag, Users, CheckCircle, AlertTriangle } from "lucide-react";
import type { Module } from "@/types";

export const metadata = { title: "Missions — CivicGrid" };

export default async function MissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeMission = await prisma.mission.findFirst({
    where: { status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  const missionModules = (activeMission?.modules as Module[]) ?? [];
  const missionActions = activeMission
    ? await prisma.action.findMany({
        where: { module: { in: activeMission.modules as any[] } },
        orderBy: { priority: "asc" },
      })
    : [];

  const criticalActions = missionActions.filter((a) => a.priority === "CRITICAL");
  const highActions = missionActions.filter((a) => a.priority === "HIGH");

  const metadata_ = activeMission?.metadata as Record<string, unknown>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Flag size={24} color="#c2410c" />
          <div>
            <h1 style={{ margin: 0, color: "#c2410c" }}>Mission Control</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Cross-domain emergency coordination
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {activeMission && (
          <>
            {/* Mission Banner */}
            <div style={{
              background: "#fff7ed",
              border: "2px solid #c2410c",
              borderRadius: 10,
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <span style={{
                      background: "#b91c1c",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.08em",
                    }}>
                      🔴 ACTIVE MISSION
                    </span>
                    <PriorityBadge priority="CRITICAL" />
                  </div>
                  <h2 style={{ margin: "0 0 4px", color: "#0f172a" }}>{activeMission.title}</h2>
                  <p style={{ margin: 0, color: "#9a3412", fontSize: "0.875rem" }}>
                    {activeMission.description}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Started</div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>
                    {new Date(activeMission.startedAt!).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Mission Modules */}
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {missionModules.map((mod) => (
                  <ModuleBadge key={mod} module={mod as Module} />
                ))}
              </div>

              {/* Mission Stats */}
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
                {[
                  { label: "Critical Actions", value: metadata_?.critical_actions as number, color: "#b91c1c" },
                  { label: "High Actions", value: metadata_?.high_actions as number, color: "#c2410c" },
                  { label: "Hospitals Secured", value: metadata_?.affected_hospitals as number, color: "#0e7490" },
                  { label: "Roads Monitored", value: metadata_?.affected_roads as number, color: "#1d4ed8" },
                  { label: "Drainage Ops", value: metadata_?.drainage_interventions as number, color: "#15803d" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: "white",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: "1.5rem", color: stat.color, lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div style={{ marginBottom: "1.5rem" }}>
              <SectionHeader title="Coordinating Departments" />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(metadata_?.departments as string[] | undefined)?.map((dept) => (
                  <div key={dept} style={{
                    padding: "8px 14px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}>
                    <Users size={14} color="#1d4ed8" />
                    {dept}
                    <CheckCircle size={14} color="#15803d" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Summary */}
            <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f0f9ff", border: "1px solid #bae6fd" }}>
              <div style={{ fontWeight: 700, color: "#0369a1", marginBottom: 8 }}>AI Mission Summary</div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#0c4a6e", lineHeight: 1.6 }}>
                {metadata_?.summary as string}
              </p>
            </div>

            {/* Critical Actions */}
            {criticalActions.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <SectionHeader
                  title="Critical Actions"
                  count={criticalActions.length}
                  description="Require immediate human decision"
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {criticalActions.map((action) => (
                    <div key={action.id} className="card" style={{
                      padding: "1rem",
                      borderLeft: "4px solid #b91c1c",
                    }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <PriorityBadge priority={action.priority} />
                        <ModuleBadge module={action.module} />
                        <StatusBadge status={action.status} />
                      </div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9375rem" }}>{action.title}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 4 }}>{action.description}</div>
                      <div style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        background: "#f0fdf4",
                        border: "1px solid #dcfce7",
                        borderRadius: 6,
                        fontSize: "0.875rem",
                        color: "#15803d",
                      }}>
                        <span style={{ fontWeight: 700 }}>→ </span>{action.recommendedAction}
                      </div>
                      <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#94a3b8" }}>
                        {action.ward} · {action.assignedDept} · Due: {action.dueAt ? new Date(action.dueAt).toLocaleString("en-IN") : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Actions table */}
            {highActions.length > 0 && (
              <div>
                <SectionHeader title="High-Priority Actions" count={highActions.length} />
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Module</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highActions.map((action) => (
                        <tr key={action.id}>
                          <td style={{ fontWeight: 600, fontSize: "0.875rem" }}>{action.title}</td>
                          <td><ModuleBadge module={action.module} /></td>
                          <td style={{ fontSize: "0.8125rem" }}>{action.ward}</td>
                          <td><StatusBadge status={action.status} /></td>
                          <td style={{ fontSize: "0.8125rem" }}>{action.assignedDept}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
