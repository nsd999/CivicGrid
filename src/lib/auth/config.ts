import type { UserRole } from "@/types";

/**
 * CivicGrid frontend/demo authentication.
 *
 * Supabase authentication is intentionally bypassed while the backend
 * is unavailable. This keeps the prototype usable as a frontend demo.
 * Replace this file with the real auth implementation when the backend
 * is restored.
 */

const DEMO_USER = {
  id: "demo-admin",
  email: "admin@civicgrid.demo",
  name: "CivicGrid Administrator",
  role: "ADMIN" as UserRole,
  department: "District Administration",
};

export async function auth() {
  return { user: DEMO_USER };
}

export async function signOut() {
  // No backend session in frontend demo mode.
}
