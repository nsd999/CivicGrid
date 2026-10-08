"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, CircleUserRound, Home, MapPin, Menu, ShieldCheck, X, Grid2X2 } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Grid2X2 },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export function CivicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="civic-app">
      <header className="civic-header">
        <div className="civic-header-inner">
          <Link href="/" className="civic-brand" aria-label="CivicGrid home">
            <img src="/logo.jpg" alt="" className="civic-logo" />
            <span>CivicGrid</span>
          </Link>

          <nav className="civic-desktop-nav" aria-label="Primary navigation">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={pathname === href ? "civic-nav-link active" : "civic-nav-link"}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="civic-header-actions">
            <Link href="/services" className="civic-location-pill">
              <MapPin size={16} aria-hidden="true" />
              <span>Set location</span>
              <ChevronDown size={15} aria-hidden="true" />
            </Link>
            <button className="civic-menu-button" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="civic-drawer-layer" role="dialog" aria-modal="true" aria-label="CivicGrid menu">
          <button className="civic-drawer-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="civic-drawer">
            <div className="civic-drawer-head">
              <div className="civic-brand"><img src="/logo.jpg" alt="" className="civic-logo" /><span>CivicGrid</span></div>
              <button className="civic-icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            <div className="civic-drawer-location"><MapPin size={17} /><div><strong>Location</strong><span>Choose your city or locality</span></div></div>
            <nav className="civic-drawer-nav">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href ? "active" : ""}>
                  <Icon size={19} /> <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="civic-drawer-note"><ShieldCheck size={18} /><span>Citizen-first service interface. Information is shown with source and update status where available.</span></div>
          </aside>
        </div>
      )}

      <main className="civic-main">{children}</main>

      <nav className="civic-bottom-nav" aria-label="Mobile navigation">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined}>
            <Icon size={21} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
