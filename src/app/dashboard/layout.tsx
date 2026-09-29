import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { DEMO_NOTIFICATIONS } from "@/data/demo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const unreadCount = DEMO_NOTIFICATIONS.filter(
    (n) => !n.isRead && n.profileId === session.user.id
  ).length;

  return (
    <div className="app-shell">
      <Sidebar
        userRole={session.user.role}
        userName={session.user.name}
        unreadNotifications={unreadCount}
      />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
