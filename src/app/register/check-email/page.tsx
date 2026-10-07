import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <main className="login-page">
      <section className="login-form-card card" style={{ width: "100%", maxWidth: 520, margin: "auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: "#dcfce7", color: "#15803d", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <MailCheck size={29} />
          </div>
          <div className="login-form-heading">
            <h2>Check your email</h2>
            <p>We sent you a verification link. Open the email and click the link to confirm your email address.</p>
          </div>
          <p style={{ color: "#64748b", fontSize: ".82rem", lineHeight: 1.6 }}>
            After you verify your email, come back to CivicGrid and sign in.
            If you don't see the email, check your spam or junk folder.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link href="/login" className="btn btn-primary">Go to Sign in</Link>
            <Link href="/" className="btn btn-secondary">Back to CivicGrid</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
