import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import type { UserRole } from "@/types";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(...roles: UserRole[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) redirect("/dashboard");
  return session;
}
