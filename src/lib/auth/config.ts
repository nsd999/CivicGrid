import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import type { UserRole } from "@/types";

export async function auth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
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
      }
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
