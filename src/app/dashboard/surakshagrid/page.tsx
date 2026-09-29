import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DEMO_ACTIONS, DEMO_RISKS, DEMO_ASSETS } from "@/data/demo";
import { PriorityBadge, StatusBadge, SectionHeader, AIIndicator, StatCard } from "@/components/ui";
import { Shield, AlertTriangle } from "lucide-react";

export const metadata = { title: "SurakshaGrid — Disaster Risk Intelligence" };

export default async function SurakshaGridPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const surakshaActions = DEMO_ACTIONS.filter((a) => a.module === "SURAKSHAGRID");
  const surakshaRisks = DEMO_RISKS.filter((r) => r.module === "SURAKSHAGRID");
  const bridges = DEMO_ASSETS.filter((a) => a.type === "BRIDGE");

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Shield size={24} color="#b91c1c" />
          <div>
            <h1 style={{ margin: 0, color: "#b91c1c" }}>SurakshaGrid</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Disaster risk intelligence · Structural and infrastructure safety
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="High-Risk Assets" value={surakshaRisks.length} color="#b91c1c" />
          <StatCard label="Bridges Monitored" value={bridges.length} color="#c2410c" />
          <StatCard label="Active Actions" value={surakshaActions.length} color="#1d4ed8" />
          <StatCard label="Pending Inspections" value={1} color="#b45309" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Risk Assessments */}
          <div>
            <SectionHeader title="Structural Risk Assessments" count={surakshaRisks.length} />
            {surakshaRisks.map((risk) => (
              <div key={risk.id} className="card" style={{ padding: "1rem", marginBottom: 8, borderLeft: "3px solid #b91c1c" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <PriorityBadge priority={risk.priority} />
                </div>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                  {risk.assetId ? DEMO_ASSETS.find(a => a.id === risk.assetId)?.name ?? risk.ward : risk.ward}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: 8 }}>
                  Risk Score: <strong>{risk.priorityScore}</strong>/100 · {risk.populationAffected?.toLocaleString()} affected
                </div>
                {risk.factors.map((f) => (
                  <div key={f.factor} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8125rem",
                    padding: "4px 0",
                    borderBottom: "1px solid #f8fafc",
                    color: "#475569",
                  }}>
                    <span>→ {f.label}</span>
                    <span style={{ fontWeight: 600, color: "#1d4ed8" }}>+{f.contribution}</span>
                  </div>
                ))}
                {risk.aiExplanation && (
                  <div style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: 5,
                    fontSize: "0.8125rem",
                    color: "#9a3412",
                  }}>
                    <AIIndicator /> {risk.aiExplanation.slice(0, 180)}...
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bridge Monitoring + Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <SectionHeader title="Bridge Monitoring" count={bridges.length} />
              {bridges.map((bridge) => {
                const age = bridge.metadata?.age_years as number ?? 0;
                const riskLevel = age >= 40 ? "CRITICAL" : age >= 30 ? "HIGH" : "MEDIUM";
                return (
                  <div key={bridge.id} className="card" style={{ padding: "1rem", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{bridge.name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{bridge.ward} · {bridge.address}</div>
                      </div>
                      <PriorityBadge priority={riskLevel as "CRITICAL" | "HIGH" | "MEDIUM"} />
                    </div>
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "0.8125rem" }}>
                      <div>
                        <span style={{ color: "#94a3b8" }}>Age: </span>
                        <span style={{ fontWeight: 600, color: age >= 40 ? "#b91c1c" : "#0f172a" }}>
                          {bridge.metadata?.age_years as number} years
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#94a3b8" }}>Last inspected: </span>
                        <span style={{ fontWeight: 600 }}>{bridge.metadata?.last_inspection as string}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Actions */}
            <div>
              <SectionHeader title="Active Actions" count={surakshaActions.length} />
              {surakshaActions.map((action) => (
                <div key={action.id} className="card" style={{ padding: "0.875rem", marginBottom: 8, borderLeft: "3px solid #b91c1c" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <PriorityBadge priority={action.priority} />
                    <StatusBadge status={action.status} />
                    {action.aiGenerated && <AIIndicator />}
                  </div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{action.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#15803d", marginTop: 6, fontStyle: "italic" }}>
                    → {action.recommendedAction}
                  </div>
                  {action.aiGenerated && action.aiApproved === false && (
                    <div style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 8,
                      padding: "8px",
                      background: "#eff6ff",
                      borderRadius: 6,
                    }}>
                      <span style={{ fontSize: "0.8125rem", color: "#1d4ed8", fontWeight: 600 }}>⚠ Awaiting approval</span>
                      <button style={{ background: "#1d4ed8", color: "white", border: "none", padding: "4px 12px", borderRadius: 4, fontSize: "0.8125rem", cursor: "pointer", fontWeight: 600 }}>
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
