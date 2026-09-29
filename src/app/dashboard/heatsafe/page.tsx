import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getWeatherData } from "@/lib/data-providers/owm";

import { PriorityBadge, StatusBadge, SectionHeader, AIIndicator, StatCard } from "@/components/ui";
import { Thermometer, Users, Droplets, AlertTriangle, CloudSun } from "lucide-react";

export const metadata = { title: "HeatSafe India — Heat Risk & Vulnerability" };

export default async function HeatSafePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const weatherData = await getWeatherData("Hyderabad,IN");

  const heatActions = await prisma.action.findMany({
    where: { module: "HEATSAFE_INDIA" },
    orderBy: { priority: "asc" },
  });
  const heatRisks = await prisma.riskAssessment.findMany({
    where: { module: "HEATSAFE_INDIA" },
    orderBy: { priorityScore: "desc" },
  });
  const criticalWards = heatRisks.filter((w) => w.priority === "CRITICAL");

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Thermometer size={24} color="#c2410c" />
          <div>
            <h1 style={{ margin: 0, color: "#c2410c" }}>HeatSafe India</h1>
            <div style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Heat risk vulnerability mapping · Hyderabad District</span>
              <span style={{ 
                background: weatherData.provenance.status === "LIVE" ? "#dcfce7" : "#fef08a", 
                color: weatherData.provenance.status === "LIVE" ? "#166534" : "#854d0e",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontWeight: 600
              }}>
                {weatherData.provenance.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Heatwave alert */}
        {weatherData.feels_like >= 40 && (
          <div style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderLeft: "4px solid #c2410c",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <AlertTriangle size={22} color="#c2410c" />
            <div>
              <div style={{ fontWeight: 700, color: "#c2410c" }}>
                🌡️ IMD HEATWAVE DECLARATION — {criticalWards.length} Ward{criticalWards.length !== 1 ? "s" : ""} at CRITICAL risk
              </div>
              <div style={{ color: "#9a3412", fontSize: "0.8125rem", marginTop: 2 }}>
                Heat index reaching {Math.round(weatherData.feels_like)}°C. Vulnerable population protection measures must be activated immediately.
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="Live Heat Index" value={`${Math.round(weatherData.feels_like)}°C`} color="#b91c1c" />
          <StatCard label="Critical Wards" value={criticalWards.length} color="#c2410c" />
          <StatCard label="Elderly at Risk" value="3,400+" color="#b45309" />
          <StatCard label="Cooling Points Active" value={heatRisks.reduce((s, w) => {
            const factors = w.factors as any[];
            const coolingPts = Array.isArray(factors) ? (factors.find((f: any) => f.factor === "cooling_points")?.value || 0) : 0;
            return s + Number(coolingPts);
          }, 0)} color="#15803d" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Ward Vulnerability */}
          <div>
            <SectionHeader
              title="Ward Heat Risk"
              description="Composite vulnerability scoring"
              count={heatRisks.length}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {heatRisks.map((ward) => {
                const factors = ward.factors as any[];
                const heatIndex = Array.isArray(factors) ? (factors.find((f: any) => f.factor === "heat_index")?.value || 42) : 42;
                const elderlyCount = ward.populationAffected || 0;
                const waterAccess = Array.isArray(factors) ? (factors.find((f: any) => f.factor === "water_access")?.value || "LOW") : "LOW";
                const coolingPoints = Array.isArray(factors) ? (factors.find((f: any) => f.factor === "cooling_points")?.value || 0) : 0;

                return (
                <div key={ward.id} className="card" style={{
                  padding: "1rem",
                  borderLeft: `3px solid ${ward.priority === "CRITICAL" ? "#b91c1c" : ward.priority === "HIGH" ? "#c2410c" : "#b45309"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <PriorityBadge priority={ward.priority} />
                      </div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{ward.ward || "Unknown Ward"}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{ward.ward || "Unknown Ward"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "1.5rem", color: Number(heatIndex) >= 42 ? "#b91c1c" : "#c2410c", lineHeight: 1 }}>
                        {heatIndex}°
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>heat index</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div style={{ textAlign: "center", padding: "6px", background: "#f8fafc", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.9375rem" }}>
                        {Number(elderlyCount).toLocaleString()}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Elderly</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "6px", background: "#f8fafc", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: waterAccess === "LOW" ? "#b91c1c" : "#0f172a", fontSize: "0.9375rem" }}>
                        {waterAccess}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Water access</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "6px", background: Number(coolingPoints) === 0 ? "#fee2e2" : "#dcfce7", borderRadius: 5 }}>
                      <div style={{ fontWeight: 600, color: Number(coolingPoints) === 0 ? "#b91c1c" : "#15803d", fontSize: "0.9375rem" }}>
                        {coolingPoints}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Cooling pts</div>
                    </div>
                  </div>

                  {Number(coolingPoints) === 0 && (
                    <div style={{
                      marginTop: 8,
                      padding: "6px 10px",
                      background: "#fee2e2",
                      borderRadius: 5,
                      fontSize: "0.8125rem",
                      color: "#b91c1c",
                      fontWeight: 600,
                    }}>
                      ⚠ No active cooling point within 2km
                    </div>
                  )}

                  {/* Heat index bar */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{
                      height: 6,
                      background: "#f1f5f9",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(((Number(heatIndex) - 28) / 20) * 100, 100)}%`,
                        background: Number(heatIndex) >= 42 ? "linear-gradient(90deg, #fb923c, #b91c1c)" : "linear-gradient(90deg, #fbbf24, #c2410c)",
                        borderRadius: 3,
                      }} />
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.6875rem",
                      color: "#94a3b8",
                      marginTop: 2,
                    }}>
                      <span>28° (caution)</span>
                      <span>35° (danger)</span>
                      <span>48° (extreme)</span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* ASHA Worker Status */}
            <div className="card">
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="#c2410c" />
                ASHA Worker Alert Status
              </div>
              {[
                { ward: "Ward 18 Mehdipatnam", status: "NOTIFIED", ashas: 24, color: "#15803d" },
                { ward: "Ward 59 Dilsukhnagar", status: "DEPLOYED", ashas: 18, color: "#1d4ed8" },
                { ward: "Ward 61 LB Nagar", status: "NOTIFIED", ashas: 12, color: "#15803d" },
                { ward: "Ward 16 Jubilee Hills", status: "STANDBY", ashas: 8, color: "#b45309" },
              ].map((w) => (
                <div key={w.ward} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{w.ward}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{w.ashas} ASHA workers</div>
                  </div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: w.color + "22",
                    color: w.color,
                    border: `1px solid ${w.color}44`,
                  }}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Water Distribution */}
            <div className="card">
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Droplets size={18} color="#0e7490" />
                Water Tanker Deployment
              </div>
              {[
                { ward: "Ward 18 Mehdipatnam", tankers: 1, status: "ACTIVE", capacity: "5000L" },
                { ward: "Ward 59 Dilsukhnagar", tankers: 1, status: "ACTIVE", capacity: "5000L" },
                { ward: "Ward 61 LB Nagar", tankers: 0, status: "NEEDED", capacity: "—" },
              ].map((w) => (
                <div key={w.ward} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{w.ward}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{w.tankers} tanker{w.tankers !== 1 ? "s" : ""} · {w.capacity}</div>
                  </div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: w.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                    color: w.status === "ACTIVE" ? "#15803d" : "#b91c1c",
                    border: `1px solid ${w.status === "ACTIVE" ? "#bbf7d0" : "#fecaca"}`,
                  }}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Actions */}
            <div>
              <SectionHeader title="Heat Response Actions" count={heatActions.length} />
              {heatActions.map((action) => (
                <div key={action.id} className="card" style={{
                  padding: "0.875rem",
                  marginBottom: 8,
                  borderLeft: `3px solid ${action.priority === "CRITICAL" ? "#b91c1c" : "#c2410c"}`,
                }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <PriorityBadge priority={action.priority} />
                    <StatusBadge status={action.status} />
                    {action.aiGenerated && <AIIndicator />}
                  </div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{action.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 4 }}>{action.reason}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#c2410c", marginTop: 6, fontStyle: "italic" }}>
                    → {action.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
