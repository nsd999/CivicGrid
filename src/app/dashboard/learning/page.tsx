import Link from "next/link";
import { BookOpen, Landmark, ShieldCheck, HeartPulse, CloudRain, Sun, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Learning Hub — CivicGrid",
  description: "Learn how government, communities and civic systems work in simple language.",
};

const lessons = [
  {
    slug: "how-government-works",
    title: "How Government Works",
    description: "Understand the roles of local, state and central government in everyday life.",
    icon: Landmark,
    tone: "#1d4ed8",
    topics: ["Local government", "State government", "Central government", "Who is responsible for what?"],
  },
  {
    slug: "citizen-rights-responsibilities",
    title: "Citizen Rights & Responsibilities",
    description: "Learn the basics of civic rights, responsibilities and responsible participation.",
    icon: ShieldCheck,
    tone: "#15803d",
    topics: ["Civic duties", "Public services", "Complaints & grievance systems", "Community participation"],
  },
  {
    slug: "public-health",
    title: "Public Health Basics",
    description: "Learn how public-health systems prepare for everyday needs and emergencies.",
    icon: HeartPulse,
    tone: "#0e7490",
    topics: ["Primary healthcare", "Emergency preparedness", "Health facilities", "Community health"],
  },
  {
    slug: "disaster-readiness",
    title: "Disaster Readiness",
    description: "Build practical awareness for floods, extreme weather and local emergencies.",
    icon: CloudRain,
    tone: "#0369a1",
    topics: ["Before an emergency", "During an emergency", "Flood safety", "Emergency communication"],
  },
  {
    slug: "heat-safety",
    title: "Heat Safety",
    description: "Understand heat risk and simple steps that can protect people during hot weather.",
    icon: Sun,
    tone: "#c2410c",
    topics: ["Heat risk", "Warning signs", "Keeping cool", "Helping vulnerable people"],
  },
  {
    slug: "civil-services-civic-basics",
    title: "Civil Services & Civic Basics",
    description: "A foundation for students preparing for civic and public-service examinations.",
    icon: GraduationCap,
    tone: "#7c3aed",
    topics: ["Indian polity basics", "Governance terms", "Public administration", "Revision approach"],
  },
];

export default function LearningPage() {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BookOpen size={24} color="#7c3aed" />
          <div>
            <h1 style={{ margin: 0 }}>Learning Hub</h1>
            <p style={{ margin: "2px 0 0", fontSize: ".8125rem", color: "#64748b" }}>
              Understand civic life, government and public safety in simple language.
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: 18, marginBottom: 18, background: "#faf5ff", borderColor: "#e9d5ff" }}>
          <div style={{ fontWeight: 800, color: "#581c87" }}>Learn → Understand → Participate</div>
          <p style={{ margin: "6px 0 0", color: "#6b21a8", fontSize: ".84rem", lineHeight: 1.6 }}>
            CivicGrid is not only a dashboard. Use these lessons to understand how public systems work and make better civic decisions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
          {lessons.map(({ slug, title, description, icon: Icon, tone, topics }) => (
            <Link key={slug} href={"/dashboard/learning/" + slug} style={{ textDecoration: "none" }}>
              <article className="card" style={{ height: "100%", padding: 18, transition: "transform .15s, box-shadow .15s" }}>
                <Icon size={25} color={tone} />
                <h2 style={{ margin: "12px 0 5px", fontSize: "1rem", color: "#0f172a" }}>{title}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: ".8rem", lineHeight: 1.55 }}>{description}</p>
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {topics.map((topic) => (
                    <span key={topic} style={{ padding: "4px 7px", borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: ".68rem" }}>
                      {topic}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 15, color: tone, fontWeight: 700, fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5 }}>
                  Start lesson <ArrowRight size={14} />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
