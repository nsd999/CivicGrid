"use client";

import { useActionState, useState } from "react";
import { signIn } from "./actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="login-page">
      <div className="login-card-wrap">
        <section className="login-intro">
          <div className="login-brand">
            <img src="/logo.jpg" alt="CivicGrid" />
            <div>
              <strong>CivicGrid</strong>
              <span>Public Intelligence Platform</span>
            </div>
          </div>

          <h1>See. Understand.<br />Prioritise. Act.</h1>
          <p>
            One place to understand what is happening around your community,
            learn about civic issues and take the right action.
          </p>

          <div className="login-features">
            {[
              ["CivicGrid", "Public infrastructure"],
              ["SwasthyaGrid", "Public health"],
              ["SurakshaGrid", "Safety & disaster risk"],
              ["MonsoonShield", "Flood & rainfall"],
              ["HeatSafe India", "Heat & weather risk"],
              ["Mission Mode", "Coordinated action"],
            ].map(([label, desc]) => (
              <div key={label} className="login-feature">
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="login-form-card card">
          <div className="login-form-heading">
            <h2>Welcome back</h2>
            <p>Sign in to continue to CivicGrid.</p>
          </div>

          <form action={formAction} className="login-form">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {state.error && (
              <div className="login-error" role="alert">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={pending}
            >
              {pending ? "Signing you in…" : "Sign in"}
            </button>
          </form>

          <p className="login-help">
            Having trouble signing in? Please check your email and password and try again.
          </p>
        </section>
      </div>
    </main>
  );
}
