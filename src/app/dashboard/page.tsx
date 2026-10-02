import {
  AlertTriangle,
  Activity,
  ArrowRight,
  CheckCircle,
  Droplets,
  Shield,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Home — CivicGrid" };

const priorities = [
  {
    priority: "CRITICAL",
    title: "Water pipeline pressure anomaly",
    reason: "Detected abnormal pressure pattern in Ward 12.",
    action: "Inspect the affected line and verify supply continuity.",
    ward: "Ward 12",
    dept: "Water Works",
  },
  {
    priority: "HIGH",
    title: "Drainage capacity alert",
    reason: "Rainfall and drainage indicators show elevated flood exposure.",
    action: "Clear priority drains and inspect known low-lying points.",
    ward: "Ward 8",
    dept: "GHMC",
  },
  {
    priority: "HIGH",
    title: "Heat-risk threshold crossed",
    reason: "Heat index has moved above the prototype alert threshold.",
    action: "Review cooling-centre readiness and public messaging.",
    ward: "Ward 21",
    dept: "Health",
  },
  {
    priority: "MEDIUM",
    title: "Street-light maintenance cluster",
    reason: "Multiple citizen reports are grouped in the same area.",
    action: "Schedule an inspection route for the field team.",
    ward: "Ward 17",
    dept: "Electrical",
  },
];

const risks = [
  ["Ward 12", "Water resilience", 86, "1,240"],
  ["Ward 8", "Flood exposure", 78, "3,850"],
  ["Ward 21", "Heat exposure", 72, "2,610"],
];

const events = [
  ["Heavy rainfall advisory", "MonsoonShield", "HIGH"],
  ["Water pressure anomaly", "CivicGrid Core", "CRITICAL"],
  ["Heat index threshold crossed", "HeatSafe India", "HIGH"],
  ["Drainage inspection requested", "MonsoonShield", "MEDIUM"],
];

const badge = (value: string) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 7px",
  borderRadius: 5,
  fontSize: "0.7rem",
  fontWeight: 700,
  background:
    value === "CRITICAL" ? "#fee2e2" :
    value === "HIGH" ? "#fff7ed" :
    "#fefce8",
  color:
    value === "CRITICAL" ? "#b91c1c" :
    value === "HIGH" ? "#c2410c" :
    "#a16207",
});

export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Good morning, Administrator 👋</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Frontend demonstration · Hyderabad District
            </p>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#0369a1", background: "#e0f2fe", padding: "5px 10px", borderRadius: 5, fontWeight: 700 }}>
            ● DEMO MODE
          </span>
        </div>
      </div>

      <div className="page-body">
        <div style={{ marginBottom: "1.5rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderLeft: "4px solid #2563eb", borderRadius: 8, padding: "12px 14px", color: "#1e40af", fontSize: "0.8125rem" }}>
          Supabase/backend services are temporarily bypassed. The dashboard below uses local frontend demo data so the UI remains usable.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            ["Critical Issues", "4", <AlertTriangle size={21} />, "#b91c1c"],
            ["High Priority", "7", <Zap size={21} />, "#c2410c"],
            ["Active Risks", "12", <Shield size={21} />, "#b45309"],
            ["Pending Actions", "18", <Activity size={21} />, "#1d4ed8"],
            ["Resolved Today", "24", <CheckCircle size={21} />, "#15803d"],
          ].map(([label, value, icon, color]) => (
            <div className="card" key={label as string} style={{ padding: "1rem" }}>
              <div style={{ color: color as string, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>{value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: "1.5rem", alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1rem" }}>Today's Priorities</h2>
                <p style={{ margin: "3px 0 0", fontSize: "0.75rem", color: "#64748b" }}>Prototype operational intelligence</p>
              </div>
              <Link href="/dashboard/action-centre" style={{ color: "#1d4ed8", fontSize: "0.8125rem", textDecoration: "none" }}>View all <ArrowRight size={13} style={{ verticalAlign: "middle" }} /></Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {priorities.map((item) => (
                <div className="card" key={item.title} style={{ padding: "1rem", borderLeft: `3px solid ${item.priority === "CRITICAL" ? "#b91c1c" : "#c2410c"}` }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                    <span style={badge(item.priority)}>{item.priority}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.92rem" }}>{item.title}</div>
                  <div style={{ color: "#64748b", fontSize: "0.8rem", margin: "4px 0 8px" }}>{item.reason}</div>
                  <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#166534", borderRadius: 5, padding: "7px 9px", fontSize: "0.78rem" }}>
                    <strong>→ Recommended:</strong> {item.action}
                  </div>
                  <div style={{ marginTop: 9, color: "#94a3b8", fontSize: "0.72rem" }}>📍 {item.ward} · {item.dept}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: "1rem" }}>Active Risks</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {risks.map(([ward, type, score, affected]) => (
                  <div className="card" key={ward as string} style={{ padding: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.84rem" }}>{ward}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{type}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: "#b45309" }}>{score}/100</div>
                    </div>
                    <div style={{ marginTop: 6, fontSize: "0.72rem", color: "#94a3b8" }}>{affected} people potentially affected</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: "1rem" }}>Recent Events</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {events.map(([title, module, severity]) => (
                  <div className="card" key={title as string} style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 650 }}>{title}</div>
                      <span style={badge(severity as string)}>{severity}</span>
                    </div>
                    <div style={{ marginTop: 3, fontSize: "0.68rem", color: "#94a3b8" }}>{module}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 9 }}>Quick Actions</div>
              {[
                ["📝", "Submit Citizen Report", "/dashboard/civicgrid/report"],
                ["🗺️", "View District Map", "/dashboard/map"],
                ["🚨", "Mission Control", "/dashboard/missions"],
                ["⚙️", "AI Provider Health", "/dashboard/admin/ai-health"],
              ].map(([icon, label, href]) => (
                <Link key={href} href={href} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", color: "#1d4ed8", textDecoration: "none", fontSize: "0.8rem", borderRadius: 5 }}>
                  <span>{icon}</span><span>{label}</span><ArrowRight size={13} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[
            ["CivicGrid Core", "Infrastructure intelligence", <Zap size={18} />],
            ["SwasthyaGrid", "Public health intelligence", <Activity size={18} />],
            ["MonsoonShield", "Flood & drainage intelligence", <Droplets size={18} />],
            ["HeatSafe India", "Extreme heat monitoring", <Sun size={18} />],
          ].map(([name, desc, icon]) => (
            <div className="card" key={name as string} style={{ padding: "0.9rem", display: "flex", gap: 9, alignItems: "center" }}>
              <div style={{ color: "#2563eb" }}>{icon}</div>
              <div><div style={{ fontWeight: 700, fontSize: "0.8rem" }}>{name}</div><div style={{ color: "#94a3b8", fontSize: "0.7rem" }}>{desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
