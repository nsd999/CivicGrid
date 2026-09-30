import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}

export function hasRole(role: UserRole | undefined, ...allowedRoles: UserRole[]) {
  return !!role && allowedRoles.includes(role);
}
