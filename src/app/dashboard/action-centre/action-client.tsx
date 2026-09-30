"use client";

import { useState } from "react";
import { StatusBadge, ModuleBadge, AIIndicator } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { Action } from "@/types";

export function ActionClientTable({ initialActions }: { initialActions: Action[] }) {
  const [actions, setActions] = useState(initialActions);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(id: string, decision: "approve" | "reject") {
    setPending(id);
    setError(null);

    try {
      const response = await fetch(`/api/actions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: { id: string; aiApproved: boolean | null; status: Action["status"] };
      };

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error ?? "Unable to update action");
      }

      setActions((current) =>
        current.map((action) =>
          action.id === id
            ? { ...action, aiApproved: result.data!.aiApproved ?? undefined, status: result.data!.status }
            : action
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update action");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="table-container">
      {error && (
        <div role="alert" style={{ padding: "8px 12px", color: "#b91c1c", background: "#fef2f2", borderBottom: "1px solid #fecaca", fontSize: "0.75rem" }}>
          {error}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Module</th>
            <th>Location</th>
            <th>Department</th>
            <th>Status</th>
            <th>Due</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => {
            const canDecide =
              action.aiGenerated &&
              action.aiApproved === false &&
              !["RESOLVED", "CLOSED"].includes(action.status);

            return (
              <tr key={action.id}>
                <td style={{ maxWidth: 320 }}>
                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem" }}>
                    {action.title}
                    {action.slaBreached && (
                      <span style={{ marginLeft: 6, fontSize: "0.7rem", background: "#fee2e2", color: "#b91c1c", padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>
                        SLA BREACH
                      </span>
                    )}
                  </div>
                  {action.reason && (
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 3, whiteSpace: "normal" }}>
                      {action.reason}
                    </div>
                  )}
                  {action.recommendedAction && (
                    <div style={{ fontSize: "0.75rem", color: "#15803d", marginTop: 4, fontStyle: "italic" }}>
                      → {action.recommendedAction}
                    </div>
                  )}
                </td>
                <td><ModuleBadge module={action.module} /></td>
                <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>{action.ward ?? "—"}</td>
                <td style={{ fontSize: "0.8125rem" }}>{action.assignedDept ?? "—"}</td>
                <td><StatusBadge status={action.status} /></td>
                <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap", color: action.slaBreached ? "#b91c1c" : "#64748b" }}>
                  {action.dueAt ? formatDateTime(action.dueAt) : "—"}
                </td>
                <td>
                  {canDecide ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button type="button" disabled={pending === action.id} onClick={() => decide(action.id, "approve")} style={{ padding: "4px 8px", background: "#15803d", color: "white", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: "pointer", opacity: pending === action.id ? 0.6 : 1 }}>
                        {pending === action.id ? "Saving…" : "Approve"}
                      </button>
                      <button type="button" disabled={pending === action.id} onClick={() => decide(action.id, "reject")} style={{ padding: "4px 8px", background: "#ef4444", color: "white", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: "pointer", opacity: pending === action.id ? 0.6 : 1 }}>
                        Reject
                      </button>
                    </div>
                  ) : action.aiGenerated ? (
                    <AIIndicator />
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Manual</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
