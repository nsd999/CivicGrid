import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

const lessons: Record<string, {
  title: string;
  intro: string;
  sections: { title: string; body: string; points: string[] }[];
}> = {
  "how-government-works": {
    title: "How Government Works",
    intro: "A simple guide to understanding who does what in public administration.",
    sections: [
      { title: "Local government", body: "Local bodies deal with many services people experience every day.", points: ["Roads and local infrastructure", "Waste and sanitation", "Drainage and local public spaces", "Local civic services"] },
      { title: "State government", body: "State departments manage major public services and administration across the state.", points: ["Health and hospitals", "Police and public safety", "State roads and transport", "Education and many state services"] },
      { title: "Central government", body: "The Union government handles matters that require national coordination and sets many national policies.", points: ["National programmes and policy", "Defence and foreign affairs", "National highways and major infrastructure", "National-level institutions"] },
    ],
  },
  "citizen-rights-responsibilities": {
    title: "Citizen Rights & Responsibilities",
    intro: "Good civic participation starts with knowing both your rights and your responsibilities.",
    sections: [
      { title: "Know your rights", body: "Citizens can expect public services to be delivered through the systems provided by law and government.", points: ["Use official grievance channels", "Ask for information through appropriate processes", "Participate responsibly in public life", "Keep records of important requests"] },
      { title: "Do your part", body: "Responsible citizens help public systems work better.", points: ["Follow local rules", "Protect public property", "Report genuine problems", "Avoid spreading unverified information"] },
    ],
  },
  "public-health": {
    title: "Public Health Basics",
    intro: "Public health is about protecting the health of communities, not only treating individual illness.",
    sections: [
      { title: "Primary healthcare", body: "Local health facilities provide accessible first-level care and connect people to higher-level services when needed.", points: ["Prevention and awareness", "Basic treatment", "Maternal and child health", "Referral to larger facilities"] },
      { title: "Prepared communities", body: "Health systems also prepare for outbreaks, extreme weather and emergencies.", points: ["Emergency plans", "Adequate supplies", "Clear communication", "Protection of vulnerable people"] },
    ],
  },
  "disaster-readiness": {
    title: "Disaster Readiness",
    intro: "A few practical preparations can reduce risk before an emergency becomes serious.",
    sections: [
      { title: "Before an emergency", body: "Know the risks around you and prepare before warnings become urgent.", points: ["Save important emergency numbers", "Keep essential medicines and documents ready", "Know safer routes and nearby safe places", "Follow official warnings"] },
      { title: "During an emergency", body: "Stay calm, follow verified instructions and avoid unnecessary travel into danger zones.", points: ["Move to safer areas when advised", "Help children, older people and vulnerable neighbours", "Do not enter moving floodwater", "Use official information sources"] },
    ],
  },
  "heat-safety": {
    title: "Heat Safety",
    intro: "Extreme heat can affect anyone, especially children, older people and people working outdoors.",
    sections: [
      { title: "Reduce heat exposure", body: "The safest approach is to reduce exposure during the hottest part of the day.", points: ["Drink water regularly", "Use shade and cool spaces", "Wear light, loose clothing", "Reduce strenuous outdoor work when heat is severe"] },
      { title: "Look after others", body: "Checking on vulnerable people can prevent serious heat-related illness.", points: ["Check older neighbours", "Watch for unusual weakness or confusion", "Move someone with symptoms to a cooler place", "Seek medical help when symptoms are severe"] },
    ],
  },
  "civil-services-civic-basics": {
    title: "Civil Services & Civic Basics",
    intro: "Use this foundation to strengthen your understanding of governance before moving into detailed exam preparation.",
    sections: [
      { title: "Build the basics", body: "Start with concepts before memorising facts.", points: ["Understand the Constitution at a basic level", "Learn the roles of institutions", "Connect policies to real public problems", "Revise with short notes and examples"] },
      { title: "A practical study habit", body: "Regular revision is more useful than trying to finish everything at once.", points: ["Study one topic at a time", "Make your own short notes", "Practise questions regularly", "Review mistakes and revisit weak topics"] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(lessons).map((slug) => ({ slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons[slug];
  if (!lesson) notFound();

  return (
    <div>
      <div className="page-header">
        <Link href="/dashboard/learning" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} /> Learning Hub
        </Link>
      </div>

      <div className="page-body">
        <article className="card" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(18px,4vw,32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7c3aed", fontWeight: 700, fontSize: ".78rem" }}>
            <BookOpen size={17} /> Civic learning
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(1.6rem,5vw,2.4rem)", color: "#0f172a" }}>{lesson.title}</h1>
          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.65 }}>{lesson.intro}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 28 }}>
            {lesson.sections.map((section) => (
              <section key={section.title} style={{ padding: 18, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a" }}>{section.title}</h2>
                <p style={{ margin: "7px 0 12px", color: "#475569", fontSize: ".86rem", lineHeight: 1.6 }}>{section.body}</p>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#334155", fontSize: ".84rem", lineHeight: 1.8 }}>
                  {section.points.map((point) => (
                    <li key={point} style={{ display: "list-item" }}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div style={{ marginTop: 22, padding: 14, borderRadius: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", display: "flex", gap: 9, alignItems: "flex-start", fontSize: ".82rem", lineHeight: 1.5 }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Use CivicGrid's live views alongside these lessons to connect what you learn with real civic situations.</span>
          </div>

          <div style={{ marginTop: 22 }}>
            <Link href="/dashboard/learning" className="btn btn-primary">
              Back to Learning Hub <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
