import type { UserRole } from "@/types";

/**
 * Temporary authentication bypass.
 *
 * Supabase Auth is intentionally disabled while the service is unavailable.
 * Database, AI, maps, reports, missions and other application services
 * remain enabled and continue to use their normal implementations.
 *
 * Restore the Supabase-backed implementation here when authentication
 * service is available again.
 */

const DEMO_USER = {
  id: "demo-admin",
  email: "admin@civicgrid.demo",
  name: "CivicGrid Administrator",
  role: "ADMINISTRATOR" as UserRole,
  department: "District Administration",
};

export async function auth() {
  return { user: DEMO_USER };
}

export async function signOut() {
  // No Supabase call while authentication is disabled.
}
