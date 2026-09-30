import { requireRole } from "@/lib/auth/guards";
import prisma from "@/lib/db";
import { Settings } from "lucide-react";

export const metadata = { title: "Administration — CivicGrid" };

export default async function AdminPage() {
  const session = await requireRole("ADMINISTRATOR", "DISTRICT_OFFICER");
  const [profiles, activeActions, auditEntries] = await Promise.all([
    prisma.profile.count(),
    prisma.action.count({ where: { status: { not: "RESOLVED" } } }),
    prisma.auditLog.count(),
  ]);

  return (
    <div>
      <div className="page-header">
        <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Settings size={22} /> Administration
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
          System status and operational administration.
        </p>
      </div>
      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          <div className="card" style={{ padding: 18 }}><div style={{ color: "#64748b", fontSize: "0.75rem" }}>Profiles</div><div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{profiles}</div></div>
          <div className="card" style={{ padding: 18 }}><div style={{ color: "#64748b", fontSize: "0.75rem" }}>Active Actions</div><div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{activeActions}</div></div>
          <div className="card" style={{ padding: 18 }}><div style={{ color: "#64748b", fontSize: "0.75rem" }}>Audit Entries</div><div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{auditEntries}</div></div>
        </div>
        <div className="card" style={{ marginTop: 16, padding: 18, color: "#475569" }}>
          Signed in as <strong>{session.user.name}</strong> ({session.user.role.replace(/_/g, " ")}).
        </div>
      </div>
    </div>
  );
}
