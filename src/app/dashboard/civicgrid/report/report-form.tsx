"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [ward, setWard] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, ward, description, isAnonymous }),
      });
      const payload = (await response.json()) as { success?: boolean; error?: string; data?: { id: string } };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to submit report");
      }

      setStatus("success");
      setMessage(`Report submitted successfully. ID: ${payload.data?.id ?? "created"}`);
      setTitle("");
      setWard("");
      setDescription("");
      setIsAnonymous(false);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit report");
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label className="label" htmlFor="title">Incident Title <span style={{ color: "red" }}>*</span></label>
        <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Heavy waterlogging at main junction" required maxLength={160} />
      </div>

      <div>
        <label className="label" htmlFor="category">Report Category <span style={{ color: "red" }}>*</span></label>
        <select id="category" className="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="ROAD">Road</option>
          <option value="DRAINAGE">Drainage / Waterlogging</option>
          <option value="WASTE">Waste / Sanitation</option>
          <option value="STREETLIGHT">Streetlight</option>
          <option value="WATER">Water Supply</option>
          <option value="PUBLIC_BUILDING">Public Building</option>
          <option value="PUBLIC_TRANSPORT">Public Transport</option>
          <option value="HEALTH">Public Health</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="ward">Location (Ward / Area) <span style={{ color: "red" }}>*</span></label>
        <input id="ward" className="input" value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g., Gachibowli, Ward 104" required maxLength={120} />
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide details about the incident and who is affected." maxLength={5000} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "#334155" }}>
        <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
        Submit anonymously
      </label>

      {message && (
        <div role="status" style={{
          padding: "10px 12px",
          borderRadius: 6,
          fontSize: "0.8125rem",
          color: status === "success" ? "#166534" : "#b91c1c",
          background: status === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${status === "success" ? "#bbf7d0" : "#fecaca"}`,
        }}>
          {message}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={status === "saving"} style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8 }}>
        <Send size={18} />
        {status === "saving" ? "Submitting…" : "Submit Report to Command Centre"}
      </button>
      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
        Photo/video evidence upload is not connected yet; the report itself is persisted and auditable.
      </div>
    </form>
  );
}
