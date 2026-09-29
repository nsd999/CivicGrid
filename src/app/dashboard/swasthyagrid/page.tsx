import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { PriorityBadge, StatusBadge, SectionHeader, AIIndicator, StatCard } from "@/components/ui";
import { Heart, AlertTriangle, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "SwasthyaGrid — Public Health Intelligence" };

export default async function SwasthyaGridPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [healthActions, phcAssets] = await Promise.all([
    prisma.action.findMany({
      where: { module: "SWASTHYAGRID" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.asset.findMany({
      where: { type: "PHC", isActive: true },
      select: { id: true, name: true, ward: true, metadata: true },
    }),
  ]);

  const healthInventory = phcAssets.map((asset) => {
    const metadata = (asset.metadata as any) || {};
    return {
      phcId: asset.id,
      phcName: asset.name,
      ward: asset.ward || "Unknown",
      medicines: Array.isArray(metadata.medicines) ? metadata.medicines : [],
    };
  });

  const criticalMeds = healthInventory.flatMap((phc) =>
    phc.medicines.filter((m: any) => m.status === "CRITICAL").map((m: any) => ({
      ...m,
      phcName: phc.phcName,
      ward: phc.ward,
    }))
  );

  const warningMeds = healthInventory.flatMap((phc) =>
    phc.medicines.filter((m: any) => m.status === "WARNING").map((m: any) => ({
      ...m,
      phcName: phc.phcName,
      ward: phc.ward,
    }))
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Heart size={24} color="#15803d" />
          <div>
            <h1 style={{ margin: 0, color: "#15803d" }}>SwasthyaGrid</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Public health operations and supply resilience · Hyderabad District
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="PHCs Monitored" value={healthInventory.length} color="#15803d" />
          <StatCard label="Critical Stockouts" value={criticalMeds.length} color="#b91c1c" />
          <StatCard label="At-Risk Medicines" value={warningMeds.length} color="#b45309" />
          <StatCard label="Health Actions" value={healthActions.length} color="#1d4ed8" />
        </div>

        {/* Critical Alerts */}
        {criticalMeds.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderLeft: "4px solid #b91c1c",
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: "0.875rem",
            }}>
              <div style={{ fontWeight: 700, color: "#b91c1c", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} />
                {criticalMeds.length} Critical Medicine Stockout{criticalMeds.length !== 1 ? "s" : ""} Predicted
              </div>
              <div style={{ color: "#991b1b", fontSize: "0.8125rem", marginTop: 4 }}>
                Immediate redistribution or emergency procurement required
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {criticalMeds.map((m: any, i: number) => (
                <div key={i} className="card" style={{ padding: "0.875rem", borderLeft: "3px solid #b91c1c" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 2 }}>
                        {m.phcName} · {m.ward}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        color: "#b91c1c",
                        lineHeight: 1,
                      }}>
                        {m.stockDays}d
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>remaining</div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    fontSize: "0.8125rem",
                  }}>
                    <div style={{ textAlign: "center", background: "#f8fafc", padding: "6px", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{m.currentStock}</div>
                      <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Current ({m.unit})</div>
                    </div>
                    <div style={{ textAlign: "center", background: "#f8fafc", padding: "6px", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{m.dailyConsumption}</div>
                      <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Daily use</div>
                    </div>
                    <div style={{ textAlign: "center", background: "#fee2e2", padding: "6px", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: "#b91c1c" }}>{m.stockDays}d</div>
                      <div style={{ color: "#991b1b", fontSize: "0.75rem" }}>Until stockout</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <AIIndicator />
                    <span style={{ fontSize: "0.8125rem", color: "#15803d" }}>
                      AI recommends: Transfer from Kukatpally PHC (31-day surplus)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHC Inventory Overview */}
        <SectionHeader title="PHC Medicine Inventory" description="Real-time supply levels" />
        <div className="table-container" style={{ marginBottom: "1.5rem" }}>
          <table>
            <thead>
              <tr>
                <th>PHC</th>
                <th>Ward</th>
                <th>Medicine</th>
                <th>Stock (days)</th>
                <th>Daily Use</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {healthInventory.flatMap((phc) =>
                phc.medicines.map((m: any, i: number) => (
                  <tr key={`${phc.phcId}-${i}`}>
                    <td style={{ fontWeight: 600, fontSize: "0.875rem" }}>{phc.phcName}</td>
                    <td style={{ fontSize: "0.8125rem", color: "#64748b" }}>{phc.ward}</td>
                    <td style={{ fontSize: "0.875rem" }}>{m.name}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 50,
                          height: 6,
                          background: "#f1f5f9",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${Math.min((m.stockDays / 35) * 100, 100)}%`,
                            height: "100%",
                            background:
                              m.status === "CRITICAL" ? "#b91c1c"
                              : m.status === "WARNING" ? "#b45309"
                              : m.status === "SURPLUS" ? "#15803d"
                              : "#1d4ed8",
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{ fontWeight: 600, color: m.status === "CRITICAL" ? "#b91c1c" : "#0f172a" }}>
                          {m.stockDays}d
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.875rem" }}>{m.dailyConsumption} {m.unit}/day</td>
                    <td>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          m.status === "CRITICAL" ? "#fee2e2"
                          : m.status === "WARNING" ? "#fef3c7"
                          : m.status === "SURPLUS" ? "#dcfce7"
                          : "#dbeafe",
                        color:
                          m.status === "CRITICAL" ? "#b91c1c"
                          : m.status === "WARNING" ? "#b45309"
                          : m.status === "SURPLUS" ? "#15803d"
                          : "#1d4ed8",
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      {m.status === "CRITICAL" && (
                        <span style={{ fontSize: "0.75rem", color: "#1d4ed8", cursor: "pointer", textDecoration: "underline" }}>
                          Approve Transfer
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Active Actions */}
        {healthActions.length > 0 && (
          <div>
            <SectionHeader title="Health Actions" count={healthActions.length} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {healthActions.map((action) => (
                <div key={action.id} className="card" style={{
                  padding: "0.875rem",
                  borderLeft: `3px solid ${action.priority === "CRITICAL" ? "#b91c1c" : "#c2410c"}`,
                }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <PriorityBadge priority={action.priority} />
                    <StatusBadge status={action.status} />
                    {action.aiGenerated && <AIIndicator />}
                  </div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{action.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 4 }}>{action.reason}</div>
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
                      <span style={{ fontSize: "0.8125rem", color: "#1d4ed8", fontWeight: 600 }}>
                        ⚠ Awaiting officer approval
                      </span>
                      <button style={{
                        background: "#1d4ed8",
                        color: "white",
                        border: "none",
                        padding: "4px 12px",
                        borderRadius: 4,
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}>
                        Approve
                      </button>
                      <button style={{
                        background: "white",
                        color: "#b91c1c",
                        border: "1px solid #fca5a5",
                        padding: "4px 12px",
                        borderRadius: 4,
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                      }}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
