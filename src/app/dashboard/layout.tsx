import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/shell";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const DEMO_USER = {
  id: "demo-admin",
  name: "CivicGrid Administrator",
  role: "ADMINISTRATOR" as const,
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let unreadCount = 3;

  try {
    unreadCount = await prisma.notification.count({
      where: { profileId: DEMO_USER.id, isRead: false },
    });
  } catch {
    // Keep the frontend usable if the database is temporarily unavailable.
  }

  return (
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
  );
}
