import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import prisma from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const unreadCount = await prisma.notification.count({
    where: { profileId: session.user.id, isRead: false },
  });

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
