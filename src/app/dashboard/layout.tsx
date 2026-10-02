import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/shell";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

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
  );
}
