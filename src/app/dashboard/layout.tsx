import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/shell";
import { getUnreadNotificationCount } from "@/lib/resilient-data";

export const dynamic = "force-dynamic";

const DEMO_USER = {
  id: "demo-admin",
  name: "CivicGrid Administrator",
  role: "ADMINISTRATOR" as const,
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: unreadCount, mode } = await getUnreadNotificationCount(DEMO_USER.id);

  return (
    <>
      <div className="demo-banner" style={{ position: "fixed", top: 0, left: 0, right: 0 }}>
        CivicGrid Learning & Public Intelligence Platform · {mode === "DATABASE" ? "Live operational data" : "Local demonstration dataset"} · Built for civic awareness, governance learning and exam preparation
      </div>
      <div style={{ paddingTop: 30 }}>
    <DashboardShell
      sidebar={
        <Sidebar
          userRole={DEMO_USER.role}
          userName={DEMO_USER.name}
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
