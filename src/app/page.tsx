import Link from "next/link";\nimport { LandingNav } from "@/components/landing-nav";
import {
  ArrowRight,
  Shield,
  Activity,
  Droplets,
  Sun,
  Zap,
  Map,
  BrainCircuit,
  ClipboardCheck,
  Radio,
  FileCheck2,
  Siren,
} from "lucide-react";

export const metadata = {
  title: "CivicGrid — Public Intelligence & Action Platform",
  description: "A traceable civic intelligence platform that turns public signals into risk-aware, accountable action.",
};

const modules = [
  { href: "/dashboard/civicgrid", name: "CivicGrid Core", icon: BuildingIcon, tone: "#2563eb", desc: "Citizen reports, infrastructure issues and service delivery." },
  { href: "/dashboard/surakshagrid", name: "SurakshaGrid", icon: Shield, tone: "#b91c1c", desc: "Infrastructure vulnerability and disaster preparedness." },
  { href: "/dashboard/swasthyagrid", name: "SwasthyaGrid", icon: Activity, tone: "#15803d", desc: "Public-health capacity and supply resilience." },
  { href: "/dashboard/monsoonshield", name: "MonsoonShield", icon: Droplets, tone: "#0e7490", desc: "Rainfall, flood exposure and drainage operations." },
  { href: "/dashboard/heatsafe", name: "HeatSafe India", icon: Sun, tone: "#c2410c", desc: "Heat-health risk, vulnerable populations and response." },
];

function BuildingIcon({ size = 24, color }: { size?: number; color?: string }) {
  return <Zap size={size} color={color} />;
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <div className="demo-banner">
        CivicGrid · Learning + Public Intelligence Platform · Built for civic awareness, governance learning and civil-services / civic-exam preparation · Not an official government application
      </div>

      <LandingNav />

      <main>
        <section className="landing-hero">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 999, background: "#eff6ff", border: "1px solid #dbeafe", color: "#1d4ed8", fontSize: ".75rem", fontWeight: 700 }}>
              <Radio size={14} /> EVENT → EVIDENCE → ACTION
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", lineHeight: 1.02, letterSpacing: "-.045em", margin: "18px 0 18px", maxWidth: 760 }}>
              See civic problems.<br />
              <span style={{ color: "#2563eb" }}>Turn intelligence into action.</span>
            </h1>
            <p style={{ fontSize: "1.08rem", lineHeight: 1.7, color: "#475569", maxWidth: 700, margin: 0 }}>
              CivicGrid connects public signals, evidence, risk assessment, human decisions and field outcomes in one traceable operating layer for safer, healthier and more resilient cities.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/dashboard" className="btn btn-primary btn-lg">Enter Command Centre <ArrowRight size={18} /></Link>
              <Link href="/modules" className="btn btn-secondary btn-lg"><Siren size={18} /> View Mission Mode</Link>
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 22, fontSize: ".78rem", color: "#64748b" }}>
              <span>✓ AI-assisted analysis</span>
              <span>✓ Deterministic priority & SLA rules</span>
              <span>✓ Human approval + audit trail</span>
            </div>
          </div>

          <div className="card" style={{ padding: 20, boxShadow: "0 18px 50px rgba(15,23,42,.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: ".7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Civic response loop</div>
                <div style={{ fontWeight: 800, marginTop: 3 }}>One system of record</div>
              </div>
              <BrainCircuit size={24} color="#4f46e5" />
            </div>
            {[
              ["01", "Signal", "Citizen / weather / sensor / government data"],
              ["02", "Risk", "Correlate, score exposure and identify priority"],
              ["03", "Decision", "AI recommendation stays reviewable by humans"],
              ["04", "Action", "Assign department, SLA and field responsibility"],
              ["05", "Verify", "Evidence, outcome and audit trail close the loop"],
            ].map(([n, title, desc], i) => (
              <div key={n} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i === 4 ? "none" : "1px solid #eef2f7" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", display: "grid", placeItems: "center", fontSize: ".68rem", fontWeight: 800, flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".86rem" }}>{title}</div>
                  <div style={{ fontSize: ".74rem", color: "#64748b", marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#0f172a", color: "white", padding: "42px 24px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ fontSize: ".7rem", color: "#93c5fd", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Built for accountable public operations</div>
            <div className="landing-capabilities" style={{ marginTop: 18 }}>
              {[
                [Map, "Universal GIS", "See reports, assets, risks and response zones together."],
                [BrainCircuit, "AI Copilot", "Classify, summarise, extract evidence and recommend."],
                [ClipboardCheck, "Action Centre", "Move from priority to assignment, SLA and status."],
                [FileCheck2, "Auditability", "Record provenance, approvals, evidence and outcomes."],
              ].map(([Icon, title, desc]) => (
                <div key={String(title)} style={{ padding: 16, border: "1px solid #334155", borderRadius: 10, background: "#111c31" }}>
                  <Icon size={20} color="#93c5fd" />
                  <div style={{ fontWeight: 700, marginTop: 10 }}>{String(title)}</div>
                  <div style={{ color: "#94a3b8", fontSize: ".78rem", lineHeight: 1.5, marginTop: 5 }}>{String(desc)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: ".72rem", color: "#2563eb", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Shared domain intelligence</div>
            <h2 style={{ fontSize: "2rem", margin: "8px 0" }}>One platform. Five operational views.</h2>
            <p style={{ color: "#64748b", margin: 0 }}>Each module feeds the same risk → decision → action workflow, so cross-domain incidents can become a single coordinated mission.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 28 }}>
            {modules.map(({ href, name, icon: Icon, tone, desc }) => (
              <Link key={name} href={href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ height: "100%", padding: 20, transition: "transform .15s, box-shadow .15s" }}>
                  <Icon size={25} color={tone} />
                  <h3 style={{ margin: "14px 0 5px", color: "#0f172a" }}>{name}</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: ".82rem" }}>{desc}</p>
                  <div style={{ marginTop: 18, color: tone, fontSize: ".78rem", fontWeight: 700, display: "flex", gap: 5, alignItems: "center" }}>Open module <ArrowRight size={14} /></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 72px" }}>
          <div className="card" style={{ padding: 24, background: "#f8fbff", borderColor: "#dbeafe" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dbeafe", display: "grid", placeItems: "center", flexShrink: 0 }}><FileCheck2 size={21} color="#1d4ed8" /></div>
              <div>
                <h3 style={{ margin: 0 }}>Evidence-first by design</h3>
                <p style={{ margin: "7px 0 0", fontSize: ".84rem", color: "#475569", maxWidth: 900 }}>
                  Every dashboard number can be treated as a claim with provenance: source, collection time, live/demo status, calculation or model context, human approval and eventual outcome. This keeps CivicGrid useful for both long-term learning and real-world civic operations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: "28px 24px", borderTop: "1px solid #e2e8f0", textAlign: "center", color: "#94a3b8", fontSize: ".75rem" }}>
        CivicGrid · Civic intelligence and governance learning platform · Not an official Government of India application
      </footer>
    </div>
  );
}
