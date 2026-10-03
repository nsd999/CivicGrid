"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Zap, Map, Bell, MoreHorizontal, Download } from "lucide-react";

const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/action-centre", label: "Actions", icon: Zap },
  { href: "/dashboard/map", label: "Map", icon: Map },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
];

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function DashboardShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="app-shell">
      <header className="mobile-topbar">
        <div className="mobile-brand">
          <img src="/logo.jpg" alt="CivicGrid" />
          <div>
            <strong>CivicGrid</strong>
            <span>Public Intelligence</span>
          </div>
        </div>
        <div className="mobile-topbar-actions">
          {installPrompt && (
            <button className="mobile-icon-button" onClick={installApp} aria-label="Install CivicGrid">
              <Download size={19} />
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(true)}
            className="mobile-icon-button"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={"dashboard-sidebar-shell " + (sidebarOpen ? "open" : "")}>
        {sidebar}
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        >
          <X size={21} />
        </button>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="More navigation">
          <MoreHorizontal size={21} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
