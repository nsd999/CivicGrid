import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import type { UserRole } from "@/types";

/**
 * Supabase-backed authentication.
 *
 * Supabase owns identity and session cookies.
 * Prisma remains the application profile/source-of-truth for CivicGrid roles,
 * departments and active-account state.
 */
export async function auth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: data.claims.sub },
    });

    if (!profile || !profile.isActive) {
      return null;
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        department: profile.department ?? undefined,
      },
    };
  } catch (err) {
    console.error("Auth DB Error:", err);
    return null;
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
