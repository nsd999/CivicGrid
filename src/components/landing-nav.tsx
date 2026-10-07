"use client";

import Link from "next/link";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px clamp(18px, 5vw, 64px)", background: "rgba(255,255,255,.96)",
      borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 30,
      backdropFilter: "blur(12px)",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <img src="/logo.jpg" alt="CivicGrid" style={{ width: 38, height: 38, borderRadius: 9, objectFit: "cover" }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>CivicGrid</div>
          <div style={{ fontSize: "0.67rem", color: "#64748b", letterSpacing: ".04em" }}>PUBLIC INTELLIGENCE PLATFORM</div>
        </div>
      </Link>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="#modules" className="btn btn-secondary btn-sm">Modules</Link>
        <Link href="/dashboard" className="btn btn-primary btn-sm">Open Command Centre</Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="landing-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <>
          <button className="landing-menu-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="landing-auth-menu">
            <div style={{ fontSize: ".72rem", color: "#64748b", marginBottom: 10 }}>
              Optional account
            </div>
            <Link href="/register" onClick={() => setOpen(false)} className="landing-auth-link">
              <UserPlus size={18} />
              <span><strong>Register</strong><small>Create an account to receive updates.</small></span>
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="landing-auth-link">
              <LogIn size={18} />
              <span><strong>Sign in</strong><small>Access your saved information and updates.</small></span>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
