"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Zap,
  Map,
  Building2,
  Heart,
  Shield,
  CloudRain,
  Thermometer,
  Flag,
  BarChart3,
  Bell,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { signOutAction } from "@/app/auth/signout/action";

type NavItem = { href: string; label: string; icon: LucideIcon; color?: string };

const NAV_ITEMS: { section: string; items: NavItem[] }[] = [
  {
    section: "Main",
    items: [
      { href: "/dashboard", label: "Home", icon: LayoutDashboard },
      { href: "/dashboard/action-centre", label: "Action Centre", icon: Zap },
      { href: "/dashboard/map", label: "Map", icon: Map },\n      { href: "/dashboard/learning", label: "Learning Hub", icon: BookOpen, color: "#7c3aed" },
    ],
  },
  {
    section: "Modules",
    items: [
      { href: "/dashboard/civicgrid", label: "CivicGrid", icon: Building2, color: "#1d4ed8" },
      { href: "/dashboard/swasthyagrid", label: "SwasthyaGrid", icon: Heart, color: "#15803d" },
      { href: "/dashboard/surakshagrid", label: "SurakshaGrid", icon: Shield, color: "#b91c1c" },
      { href: "/dashboard/monsoonshield", label: "MonsoonShield", icon: CloudRain, color: "#0e7490" },
      { href: "/dashboard/heatsafe", label: "HeatSafe India", icon: Thermometer, color: "#c2410c" },
    ],
  },
  {
    section: "Operations",
    items: [
      { href: "/dashboard/missions", label: "Missions", icon: Flag },
      { href: "/dashboard/analytics", label: "Reports & Analytics", icon: BarChart3 },
      { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/dashboard/profile", label: "Profile", icon: User },
      { href: "/dashboard/admin", label: "Administration", icon: Settings },
    ],
  },
];

interface SidebarProps {
  userRole?: string;
  userName?: string;
  unreadNotifications?: number;
}

export function Sidebar({ userRole, userName, unreadNotifications = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="sidebar"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px" }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img 
              src="/logo.jpg" 
              alt="CivicGrid Logo" 
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                flexShrink: 0,
                objectFit: "cover"
              }} 
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0f172a", lineHeight: 1 }}>
                CivicGrid
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 500 }}>
                Public Intelligence Platform
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Location indicator */}
      <div style={{
        margin: "0 12px 12px",
        padding: "8px 10px",
        background: "#f1f5f9",
        borderRadius: 6,
        fontSize: "0.75rem",
        color: "#475569",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}>
        <span>📍</span>
        <span style={{ fontWeight: 600 }}>Hyderabad District</span>
      </div>

      {/* Navigation */}
      <div style={{ padding: "0 8px" }}>
        {NAV_ITEMS.map((section) => {
          // Filter admin-only items
          const items = section.items.filter((item) => {
            if (item.href === "/dashboard/admin") {
              return userRole === "ADMINISTRATOR" || userRole === "DISTRICT_OFFICER";
            }
            return true;
          });

          if (items.length === 0) return null;

          return (
            <div key={section.section} style={{ marginBottom: 8 }}>
              <div style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "8px 12px 4px",
              }}>
                {section.section}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", { active: isActive })}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className="nav-icon"
                      aria-hidden="true"
                      style={item.color && isActive ? { color: item.color } : {}}
                    />
                    <span>{item.label}</span>
                    {item.href === "/dashboard/notifications" && unreadNotifications > 0 && (
                      <span style={{
                        marginLeft: "auto",
                        background: "#b91c1c",
                        color: "white",
                        borderRadius: 10,
                        padding: "1px 6px",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        minWidth: 18,
                        textAlign: "center",
                      }}>
                        {unreadNotifications > 9 ? "9+" : unreadNotifications}
                      </span>
                    )}
                    {item.href === "/dashboard/action-centre" && (
                      <ChevronRight size={14} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User profile at bottom */}
      {userName && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          background: "white",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#4338ca",
              flexShrink: 0,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#1e293b",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {userName}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>
                {userRole?.replace(/_/g, " ")}
              </div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Sign out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
