"use client";

import { useActionState, useState } from "react";
import { signIn } from "./actions";

const DEMO_CREDENTIALS = [
  { role: "Administrator", email: "admin@civicgrid.demo", password: "demo1234", description: "Full system access" },
  { role: "District Officer", email: "district@civicgrid.demo", password: "demo1234", description: "Cross-domain dashboard, missions" },
  { role: "Dept. Officer", email: "officer@civicgrid.demo", password: "demo1234", description: "Department issues, AI approvals" },
  { role: "Field Worker", email: "field@civicgrid.demo", password: "demo1234", description: "Tasks, evidence upload" },
  { role: "Citizen", email: "citizen@civicgrid.demo", password: "demo1234", description: "Submit reports, track status" },
];

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function fillDemo(cred: (typeof DEMO_CREDENTIALS)[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <div className="demo-banner">
        🔐 Secure authentication — CivicGrid uses Supabase Auth for identity and session management. Not affiliated with or endorsed by the Government of India.
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 960, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div style={{ padding: "2rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
              <img src="/logo.jpg" alt="CivicGrid Logo" style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#0f172a" }}>CivicGrid</div>
                <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>Public Intelligence Platform</div>
              </div>
            </div>

            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#0f172a" }}>
              See. Understand.<br />Prioritise. Act.
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              AI-powered public intelligence for safer, healthier and more resilient communities.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["CivicGrid Core", "Infrastructure", "#1d4ed8"],
                ["SwasthyaGrid", "Public Health", "#15803d"],
                ["SurakshaGrid", "Disaster Risk", "#b91c1c"],
                ["MonsoonShield", "Flood & Rain", "#0e7490"],
                ["HeatSafe India", "Heat Risk", "#c2410c"],
                ["Mission Mode", "Cross-domain ops", "#7e22ce"],
              ].map(([label, desc, color]) => (
                <div key={label} style={{ padding: "10px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>{label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: "0.8125rem", color: "#166534" }}>
              ✓ Identity is handled by Supabase Auth. CivicGrid application roles and permissions remain backed by Prisma.
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: "2rem" }}>
              <h2 style={{ margin: "0 0 1.5rem" }}>Sign in to CivicGrid</h2>

              <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="label" htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
                </div>
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" />
                </div>

                {state.error && (
                  <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: 6, fontSize: "0.875rem", border: "1px solid #fecaca" }} role="alert">
                    {state.error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%", justifyContent: "center", padding: "10px" }}>
                  {pending ? "Signing in…" : "Sign in securely"}
                </button>
              </form>

              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Existing CivicGrid demo accounts · password: demo1234
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button key={cred.email} type="button" onClick={() => fillDemo(cred)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: email === cred.email ? "#eff6ff" : "#f8fafc", border: `1px solid ${email === cred.email ? "#bfdbfe" : "#e2e8f0"}`, borderRadius: 6, cursor: "pointer", textAlign: "left" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0f172a" }}>{cred.role}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{cred.description}</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Use →</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
