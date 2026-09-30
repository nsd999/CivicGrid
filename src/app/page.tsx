import Link from "next/link";
import { ArrowRight, Shield, Activity, Droplets, Sun, Zap } from "lucide-react";

export const metadata = { title: "CivicGrid — Public Intelligence & Action Platform" };

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", background: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "1.25rem", color: "#0f172a" }}>
          <img 
            src="/logo.jpg" 
            alt="CivicGrid Logo" 
            style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }}
          />
          CivicGrid
        </div>
        <Link href="/login" style={{ padding: "8px 16px", background: "#0f172a", color: "white", textDecoration: "none", borderRadius: 6, fontWeight: 600, fontSize: "0.875rem" }}>
          Access Command Centre
        </Link>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", maxWidth: 800, lineHeight: 1.1 }}>
          Public Intelligence.<br/>
          <span style={{ color: "#2563eb" }}>Real-world Action.</span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#64748b", maxWidth: 600, marginTop: 24, lineHeight: 1.5 }}>
          CivicGrid is an AI-powered platform designed to help public-service departments see problems, prioritize risks, and coordinate interventions efficiently.
        </p>
        <div style={{ marginTop: 40 }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "#2563eb", color: "white", textDecoration: "none", borderRadius: 8, fontWeight: 600, fontSize: "1.125rem", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
            Enter Prototype Dashboard <ArrowRight size={20} />
          </Link>
        </div>

        {/* Modules Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, maxWidth: 1000, width: "100%", marginTop: 80, textAlign: "left" }}>
          {[
            { name: "CivicGrid Core", icon: <Zap color="#4f46e5" />, desc: "Unified dashboard and incident tracking" },
            { name: "SurakshaGrid", icon: <Shield color="#b91c1c" />, desc: "Disaster risk and infrastructure safety" },
            { name: "SwasthyaGrid", icon: <Activity color="#15803d" />, desc: "Public health and supply resilience" },
            { name: "MonsoonShield", icon: <Droplets color="#0e7490" />, desc: "Flood and drainage intelligence" },
            { name: "HeatSafe India", icon: <Sun color="#c2410c" />, desc: "Extreme heat and health risk tracking" }
          ].map((m) => (
            <div key={m.name} style={{ background: "white", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: 12 }}>{m.icon}</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{m.name}</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: "0.875rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0" }}>
        ⚠️ CivicGrid is a public-sector technology concept. It is not an official Government of India application.
      </footer>
    </div>
  );
}
