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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          ward,
          description,
          isAnonymous,
        }),
      });

      const result = (await response.json()) as { success?: boolean; error?: string; data?: { id: string } };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Unable to submit report");
      }

      setMessage(`Report ${result.data?.id ?? ""} submitted successfully.`);
      setTitle("");
      setWard("");
      setDescription("");
      setIsAnonymous(false);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label className="label" htmlFor="report-title">Incident Title <span style={{ color: "red" }}>*</span></label>
        <input
          id="report-title"
          type="text"
          className="input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g., Heavy waterlogging at main junction"
          required
          maxLength={160}
        />
      </div>

      <div>
        <label className="label" htmlFor="report-category">Report Category <span style={{ color: "red" }}>*</span></label>
        <select
          id="report-category"
          className="select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        >
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
        <label className="label" htmlFor="report-ward">Location (Ward / Area) <span style={{ color: "red" }}>*</span></label>
        <input
          id="report-ward"
          type="text"
          className="input"
          value={ward}
          onChange={(event) => setWard(event.target.value)}
          placeholder="e.g., Gachibowli, Ward 104"
          required
          maxLength={120}
        />
      </div>

      <div>
        <label className="label" htmlFor="report-description">Description</label>
        <textarea
          id="report-description"
          className="input"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Provide details about the incident and who is affected."
          maxLength={5000}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "#334155" }}>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(event) => setIsAnonymous(event.target.checked)}
        />
        Submit anonymously
      </label>

      {message && (
        <div role="status" style={{
          background: message.toLowerCase().includes("successfully") ? "#f0fdf4" : "#fef2f2",
          color: message.toLowerCase().includes("successfully") ? "#166534" : "#b91c1c",
          border: "1px solid currentColor",
          borderRadius: 6,
          padding: "10px 12px",
          fontSize: "0.8125rem",
        }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
        style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8 }}
      >
        <Send size={18} />
        {submitting ? "Submitting…" : "Submit Report to Command Centre"}
      </button>

      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
        Photo/video evidence upload will be enabled after production storage is configured.
      </div>
    </form>
  );
}
