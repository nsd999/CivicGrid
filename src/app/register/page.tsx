"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "./actions";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <main className="login-page">
      <div className="login-card-wrap">
        <section className="login-intro">
          <div className="login-brand">
            <img src="/logo.jpg" alt="CivicGrid" />
            <div><strong>CivicGrid</strong><span>Public Intelligence Platform</span></div>
          </div>
          <h1>Stay informed.<br /><span>Take the right action.</span></h1>
          <p>
            You can explore CivicGrid without an account. Register only if you want to receive updates,
            save your information and use account-based features.
          </p>
          <div className="login-features">
            {[
              ["Optional account", "Explore the public platform without signing in"],
              ["Email updates", "Receive important CivicGrid notifications"],
              ["Your information", "Keep your account and preferences together"],
            ].map(([label, desc]) => (
              <div key={label} className="login-feature"><strong>{label}</strong><span>{desc}</span></div>
            ))}
          </div>
        </section>

        <section className="login-form-card card">
          <div className="login-form-heading">
            <h2>Create your account</h2>
            <p>Register for CivicGrid updates and account features.</p>
          </div>

          <form action={formAction} className="login-form">
            <div>
              <label className="label" htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required autoComplete="name" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" inputMode="email" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="input" placeholder="Create a password" required minLength={8} autoComplete="new-password" />
            </div>
            <div>
              <label className="label" htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="input" placeholder="Enter the password again" required minLength={8} autoComplete="new-password" />
            </div>

            {state.error && <div className="login-error" role="alert">{state.error}</div>}

            <button type="submit" className="btn btn-primary login-submit" disabled={pending}>
              {pending ? "Creating your account…" : "Register"}
            </button>
          </form>

          <p className="login-help">
            Already registered? <Link href="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
