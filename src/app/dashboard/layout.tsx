import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/shell";
import { getUnreadNotificationCount } from "@/lib/resilient-data";
import { requireAuth } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const { data: unreadCount, mode } = await getUnreadNotificationCount(session.user.id);

  return (
    <>
      <div className="demo-banner" style={{ position: "fixed", top: 0, left: 0, right: 0 }}>
        CivicGrid Learning & Public Intelligence Platform · {mode === "DATABASE" ? "Live operational data" : "Local demonstration dataset"} · Built for civic awareness, governance learning and exam preparation
      </div>
      <div style={{ paddingTop: 30 }}>
        <DashboardShell
          sidebar={
            <Sidebar
              userRole={session.user.role}
              userName={session.user.name}
              unreadNotifications={unreadCount}
            />
          }
        >
          {children}
        </DashboardShell>
      </div>
    </>
  );
}
