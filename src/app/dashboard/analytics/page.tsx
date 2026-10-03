import { getActions, getEvents, getRisks, getReports } from "@/lib/resilient-data";
import { BarChart3, CheckCircle2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/ui";

export const metadata = { title: "Analytics & Reports — CivicGrid" };

export default async function AnalyticsPage() {
  const [reportsResult, actionsResult, eventsResult, risksResult] = await Promise.all([
    getReports(),
    getActions(),
    getEvents(),
    getRisks(),
  ]);
  const totalReports = reportsResult.data.length;
  const aiDecisions = actionsResult.data.filter((a: any) => a.aiGenerated).length;
  const criticalActions = actionsResult.data.filter((a: any) => a.priority === "CRITICAL" && !["RESOLVED", "VERIFIED", "CLOSED"].includes(a.status)).length;
  const verifiedActions = actionsResult.data.filter((a: any) => a.status === "VERIFIED").length;
  const eventCount = eventsResult.data.length;
  const riskCount = risksResult.data.length;

  const provenance = [
    { label: "Citizen reports", value: totalReports, note: "Database records", icon: Database },
    { label: "Detected events", value: eventCount, note: "Event layer", icon: RadioIcon },
    { label: "Risk assessments", value: riskCount, note: "Priority engine", icon: ShieldCheck },
    { label: "AI-assisted actions", value: aiDecisions, note: "Human-reviewable", icon: GitBranch },
    { label: "Verified outcomes", value: verifiedActions, note: "Closed-loop evidence", icon: CheckCircle2 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={22} color="#4f46e5" /> Analytics & Intelligence
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: ".8125rem", color: "#64748b" }}>
            Traceable operational metrics across the CivicGrid response loop
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="demo-banner" style={{ borderRadius: 8, marginBottom: 16 }}>
          Dataset status: live database when available; otherwise CivicGrid uses its built-in demonstration dataset so learning and evaluation can continue.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
          {provenance.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className="card" style={{ padding: 16 }}>
              <Icon size={18} color="#4f46e5" />
              <div style={{ marginTop: 12, fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" }}>{value}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#334155" }}>{label}</div>
              <div style={{ fontSize: ".72rem", color: "#94a3b8", marginTop: 3 }}>{note}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Decision trace</h2>
          <p style={{ margin: "5px 0 18px", fontSize: ".82rem", color: "#64748b" }}>
            CivicGrid is designed so an incident can be followed from source signal through risk, action and verification instead of becoming an untraceable dashboard number.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {[
              ["Signal", "Event / report"],
              ["Evidence", "Source + time"],
              ["Risk", "Score + factors"],
              ["Decision", "AI + human approval"],
              ["Outcome", "Action + verification"],
            ].map(([title, desc], i) => (
              <div key={title} style={{ padding: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                <div style={{ fontSize: ".68rem", color: "#94a3b8", fontWeight: 800 }}>0{i + 1}</div>
                <div style={{ fontWeight: 700, marginTop: 4, fontSize: ".8rem" }}>{title}</div>
                <div style={{ fontSize: ".7rem", color: "#64748b", marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16, padding: 18, background: "#f8fbff", borderColor: "#dbeafe" }}>
          <div style={{ fontWeight: 700, color: "#1e3a8a" }}>What the numbers mean</div>
          <p style={{ margin: "6px 0 0", fontSize: ".8rem", color: "#475569" }}>
            Counts above are computed from the active CivicGrid data source. When the database is unavailable, the built-in demonstration dataset is used and identified as such.
          </p>
        </div>
      </div>
    </div>
  );
}

function RadioIcon({ size = 18, color = "#4f46e5" }: { size?: number; color?: string }) {
  return <GitBranch size={size} color={color} />;
}
