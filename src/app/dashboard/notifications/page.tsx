import { requireAuth } from "@/lib/auth/guards";
import prisma from "@/lib/db";
import { Bell } from "lucide-react";

export const metadata = { title: "Notifications — CivicGrid" };

export default async function NotificationsPage() {
  const session = await requireAuth();
  const notifications = await prisma.notification.findMany({
    where: { profileId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="page-header">
        <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Bell size={22} /> Notifications</h1>
        <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>Recent alerts and workflow updates.</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 24, color: "#64748b" }}>No notifications yet.</div>
          ) : notifications.map((notification) => (
            <div key={notification.id} style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", background: notification.isRead ? "white" : "#eff6ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong style={{ color: "#0f172a", fontSize: "0.9rem" }}>{notification.title}</strong>
                <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{notification.createdAt.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ marginTop: 4, color: "#475569", fontSize: "0.8125rem", lineHeight: 1.5 }}>{notification.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
