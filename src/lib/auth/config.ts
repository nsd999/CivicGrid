// CivicGrid — Authentication Configuration (Auth.js v5 / next-auth beta)
// Server-side only

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";

// ============================================================
// DEMO USERS (used when no database is connected)
// ⚠️ DEMO DATA — Not for production
// ============================================================

export const DEMO_USERS = [
  {
    id: "demo-admin-001",
    email: "admin@civicgrid.demo",
    name: "Priya Reddy",
    role: "ADMINISTRATOR" as UserRole,
    passwordHash: "", // set below
    department: "Administration",
  },
  {
    id: "demo-district-001",
    email: "district@civicgrid.demo",
    name: "Rajesh Kumar",
    role: "DISTRICT_OFFICER" as UserRole,
    passwordHash: "",
    department: "District Administration",
  },
  {
    id: "demo-officer-001",
    email: "officer@civicgrid.demo",
    name: "Anitha Sharma",
    role: "DEPARTMENT_OFFICER" as UserRole,
    passwordHash: "",
    department: "GHMC",
  },
  {
    id: "demo-field-001",
    email: "field@civicgrid.demo",
    name: "Mohammed Rafi",
    role: "FIELD_WORKER" as UserRole,
    passwordHash: "",
    department: "GHMC",
  },
  {
    id: "demo-citizen-001",
    email: "citizen@civicgrid.demo",
    name: "Lakshmi Devi",
    role: "CITIZEN" as UserRole,
    passwordHash: "",
    department: undefined,
  },
];

// Pre-hash passwords for demo users (all: "demo1234")
const DEMO_PASSWORD = "demo1234";

// ============================================================
// CREDENTIALS SCHEMA
// ============================================================

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ============================================================
// AUTH CONFIG
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Try database first
        try {
          const { db } = await import("@/lib/db");
          const profile = await db.profile.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              department: true,
              passwordHash: true,
              isActive: true,
            },
          });

          if (profile && profile.isActive) {
            const valid = await bcrypt.compare(password, profile.passwordHash);
            if (valid) {
              return {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
                department: profile.department ?? undefined,
              };
            }
          }
        } catch (error) {
          console.error("Auth DB Error:", error);
          // Return null on failure rather than fallback
          return null;
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? "CITIZEN";
        token.department = (user as { department?: string }).department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.department = token.department as string | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours (shift duration)
  },

  trustHost: true,
});

// ============================================================
// TYPE AUGMENTATION
// ============================================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      department?: string;
      image?: string;
    };
  }
}
