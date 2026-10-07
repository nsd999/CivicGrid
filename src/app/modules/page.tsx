import Link from "next/link";
import { ArrowRight, Activity, Shield, Droplets, Sun, Building2, Flag, BookOpen } from "lucide-react";

const modules = [
  {
    slug: "civicgrid",
    name: "CivicGrid Core",
    icon: Building2,
    tone: "#2563eb",
    description: "Public infrastructure, civic reports and everyday service issues.",
    points: ["Roads & drainage", "Waste & sanitation", "Water & streetlights", "Citizen reports"],
  },
  {
    slug: "swasthyagrid",
    name: "SwasthyaGrid",
    icon: Activity,
    tone: "#15803d",
    description: "Understand public-health capacity, facilities and community risks.",
    points: ["Health facilities", "Public-health readiness", "Supplies", "Community risk"],
  },
  {
    slug: "surakshagrid",
    name: "SurakshaGrid",
    icon: Shield,
    tone: "#b91c1c",
    description: "Safety, infrastructure vulnerability and disaster preparedness.",
    points: ["Risk zones", "Critical infrastructure", "Preparedness", "Response actions"],
  },
  {
    slug: "monsoonshield",
    name: "MonsoonShield",
    icon: Droplets,
    tone: "#0e7490",
    description: "Rainfall, flooding and drainage risk for safer monsoon response.",
    points: ["Rainfall", "Flood exposure", "Drainage", "Pre-positioning"],
  },
  {
    slug: "heatsafe",
    name: "HeatSafe India",
    icon: Sun,
    tone: "#c2410c",
    description: "Heat risk, vulnerable communities and practical protection.",
    points: ["Heat index", "Vulnerable people", "Cooling points", "Heat response"],
  },
];

export default function PublicModulesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <header style={{ padding: "18px clamp(18px,5vw,64px)", background: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.jpg" alt="CivicGrid" style={{ width: 38, height: 38, borderRadius: 9 }} />
            <strong style={{ color: "#0f172a" }}>CivicGrid</strong>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/register" className="btn btn-secondary btn-sm">Register</Link>
            <Link href="/login" className="btn btn-primary btn-sm">Sign in</Link>
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(34px,7vw,72px) 24px" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ color: "#2563eb", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Explore CivicGrid</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.4rem)", lineHeight: 1.05, margin: "10px 0 14px" }}>Explore every module without signing in.</h1>
          <p style={{ color: "#64748b", lineHeight: 1.7, maxWidth: 720 }}>
            CivicGrid is open for everyone to explore. Sign in only when you want account-based features such as receiving updates.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 32 }}>
          {modules.map(({ slug, name, icon: Icon, tone, description, points }) => (
            <Link key={slug} href={"/modules/" + slug} style={{ textDecoration: "none" }}>
              <article className="card" style={{ height: "100%", padding: 20 }}>
                <Icon size={28} color={tone} />
                <h2 style={{ margin: "13px 0 6px", color: "#0f172a", fontSize: "1.08rem" }}>{name}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: ".82rem", lineHeight: 1.55 }}>{description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                  {points.map(point => <span key={point} style={{ fontSize: ".68rem", padding: "4px 7px", borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>{point}</span>)}
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 5, color: tone, fontWeight: 700, fontSize: ".78rem" }}>Explore module <ArrowRight size={14} /></div>
              </article>
            </Link>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24, padding: 18, background: "#faf5ff", borderColor: "#e9d5ff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, color: "#581c87" }}><BookOpen size={19} /> Learning is open too</div>
          <p style={{ margin: "6px 0 0", color: "#6b21a8", fontSize: ".82rem" }}>Learn how government, public services, safety and civic participation work — without creating an account.</p>
        </div>
      </section>
    </main>
  );
}
