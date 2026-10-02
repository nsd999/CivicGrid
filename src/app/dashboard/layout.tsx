import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/shell";

export const dynamic = "force-static";

const DEMO_USER = {
  id: "demo-admin",
  name: "CivicGrid Administrator",
  role: "ADMIN" as const,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={
        <Sidebar
          userRole={DEMO_USER.role}
          userName={DEMO_USER.name}
          unreadNotifications={3}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}
