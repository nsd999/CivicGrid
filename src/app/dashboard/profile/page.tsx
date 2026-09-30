import { requireAuth } from "@/lib/auth/guards";
import { User } from "lucide-react";

export const metadata = { title: "Profile — CivicGrid" };

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <div>
      <div className="page-header">
        <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><User size={22} /> Profile</h1>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 620, padding: 24 }}>
          {[
            ["Name", session.user.name],
            ["Email", session.user.email],
            ["Role", session.user.role.replace(/_/g, " ")],
            ["Department", session.user.department ?? "Not assigned"],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: "12px 0", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 3 }}>{label}</div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
