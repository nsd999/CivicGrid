import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getWeatherData } from "@/lib/data-providers/owm";

import { PriorityBadge, StatusBadge, SectionHeader, AIIndicator, StatCard } from "@/components/ui";
import { CloudRain, Waves, AlertTriangle } from "lucide-react";

export const metadata = { title: "MonsoonShield — Flood & Rainfall Intelligence" };

export default async function MonsoonShieldPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const weatherData = await getWeatherData("Hyderabad,IN");

  const monsoonActions = await prisma.action.findMany({
    where: { module: "MONSOONSHIELD" },
    orderBy: { priority: "asc" },
  });

  const monsoonRisks = await prisma.riskAssessment.findMany({
    where: { module: "MONSOONSHIELD" },
    orderBy: { priorityScore: "desc" },
  });

  const criticalZones = monsoonRisks.filter((z) => z.priority === "CRITICAL");
  const highZones = monsoonRisks.filter((z) => z.priority === "HIGH");

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CloudRain size={24} color="#0e7490" />
          <div>
            <h1 style={{ margin: 0, color: "#0e7490" }}>MonsoonShield</h1>
            <div style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Flood risk intelligence · Rainfall forecasting · Hyderabad District</span>
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
        {/* Weather Alert Banner */}
        {(weatherData.rain_1h ?? 0) > 10 || weatherData.description.includes("rain") ? (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderLeft: "4px solid #b91c1c",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <AlertTriangle size={22} color="#b91c1c" />
            <div>
              <div style={{ fontWeight: 700, color: "#b91c1c", fontSize: "0.9375rem" }}>
                🔴 WEATHER ALERT — {weatherData.description.toUpperCase()}
              </div>
              <div style={{ color: "#991b1b", fontSize: "0.8125rem", marginTop: 2 }}>
                Current live rainfall detected. Wind speed: {weatherData.wind_speed} m/s. Flood preparedness protocols should remain active.
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderLeft: "4px solid #16a34a",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <CloudRain size={22} color="#16a34a" />
            <div>
              <div style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.9375rem" }}>
                🟢 WEATHER STATUS — {weatherData.description.toUpperCase()}
              </div>
              <div style={{ color: "#166534", fontSize: "0.8125rem", marginTop: 2 }}>
                No immediate heavy rainfall detected in live telemetry. Wind speed: {weatherData.wind_speed} m/s.
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="Live Rain (1h)" value={weatherData.rain_1h ? `${weatherData.rain_1h}mm` : "0mm"} color="#0e7490" />
          <StatCard label="Critical Zones" value={criticalZones.length} color="#b91c1c" />
          <StatCard label="High-Risk Zones" value={highZones.length} color="#c2410c" />
          <StatCard label="Active Actions" value={monsoonActions.length} color="#0e7490" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Flood Risk Zones */}
          <div>
            <SectionHeader
              title="Flood Risk Zones"
              count={monsoonRisks.length}
              description="Historical + predictive flood exposure mapping"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {monsoonRisks.map((zone) => {
                const factors = zone.factors as any[];
                const depthFactor = Array.isArray(factors) 
                  ? factors.find((f: any) => f.factor === "rainfall_forecast")?.value || 45 
                  : 45;
                const affectedArea = 2.0;

                return (
                <div key={zone.id} className="card" style={{
                  padding: "1rem",
                  borderLeft: `3px solid ${zone.priority === "CRITICAL" ? "#b91c1c" : zone.priority === "HIGH" ? "#c2410c" : "#b45309"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <PriorityBadge priority={zone.priority} />
                      <div style={{ fontWeight: 700, color: "#0f172a", marginTop: 6 }}>{zone.ward || "Unknown Location"}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{zone.ward || "Unknown Ward"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#0e7490", lineHeight: 1 }}>
                        {depthFactor}cm
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>max depth</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "0.8125rem" }}>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Area affected: </span>
                      <span style={{ fontWeight: 600 }}>{affectedArea} km²</span>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Past events: </span>
                      <span style={{ fontWeight: 600 }}>{zone.recurrenceCount}</span>
                    </div>
                  </div>

                  {/* Visual flood depth bar */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{
                      height: 8,
                      background: "#f1f5f9",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min((Number(depthFactor) / 80) * 100, 100)}%`,
                        background:
                          zone.priority === "CRITICAL" ? "linear-gradient(90deg, #f97316, #b91c1c)"
                          : zone.priority === "HIGH" ? "#c2410c"
                          : "#b45309",
                        borderRadius: 4,
                        transition: "width 0.3s",
                      }} />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Pre-position Actions + Response Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* 24h Rainfall Model */}
            <div className="card">
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Waves size={18} color="#0e7490" />
                24-Hour Rainfall Forecast
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "0–6h", mm: 12, level: "LOW" },
                  { label: "6–12h", mm: 28, level: "HIGH" },
                  { label: "12–18h", mm: 45, level: "CRITICAL" },
                  { label: "18–24h", mm: 35, level: "HIGH" },
                ].map((period) => (
                  <div key={period.label} style={{
                    padding: "10px 12px",
                    background: "#f0f9ff",
                    borderRadius: 6,
                    border: "1px solid #bae6fd",
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "#0369a1", fontWeight: 600, marginBottom: 4 }}>
                      {period.label}
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                      {period.mm}mm
                    </div>
                    <PriorityBadge priority={period.level as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "8px 10px", background: "#fffbeb", borderRadius: 5, fontSize: "0.8125rem", color: "#92400e" }}>
                ⚠ Peak intensity window: 12–18h. Pre-position flood response assets before 12:00 IST.
              </div>
            </div>

            {/* Active Actions */}
            <div>
              <SectionHeader title="Pre-Event Actions" count={monsoonActions.length} />
              {monsoonActions.map((action) => (
                <div key={action.id} className="card" style={{
                  padding: "0.875rem",
                  marginBottom: 8,
                  borderLeft: `3px solid ${action.priority === "CRITICAL" ? "#b91c1c" : "#0e7490"}`,
                }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <PriorityBadge priority={action.priority} />
                    <StatusBadge status={action.status} />
                    {action.aiGenerated && <AIIndicator />}
                  </div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{action.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 4 }}>{action.reason}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#0e7490", marginTop: 6, fontStyle: "italic" }}>
                    → {action.recommendedAction}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 6 }}>
                    Due: {action.dueAt ? new Date(action.dueAt).toLocaleString("en-IN") : "—"}
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
