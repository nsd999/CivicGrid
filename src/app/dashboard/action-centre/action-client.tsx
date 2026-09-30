"use client";

import { useState } from "react";
import { PriorityBadge, StatusBadge, ModuleBadge, AIIndicator } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { Action } from "@/types";

type DecisionState = "approve" | "reject";

export function ActionClientTable({ initialActions }: { initialActions: Action[] }) {
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [pending, setPending] = useState<Record<string, DecisionState | undefined>>({});
  const [error, setError] = useState<Record<string, string | undefined>>({});

  async function handleDecision(id: string, decision: DecisionState) {
    setPending((current) => ({ ...current, [id]: decision }));
    setError((current) => ({ ...current, [id]: undefined }));

    try {
      const response = await fetch(`/api/actions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        data?: Action;
        error?: string;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Action update failed");
      }

      const updated = payload.data;
      setActions((current) =>
        current.map((action) =>
          action.id === id
            ? {
                ...action,
                aiApproved: updated.aiApproved,
                status: updated.status,
                updatedAt: updated.updatedAt,
              }
            : action
        )
      );
    } catch (err) {
      setError((current) => ({
        ...current,
        [id]: err instanceof Error ? err.message : "Action update failed",
      }));
    } finally {
      setPending((current) => ({ ...current, [id]: undefined }));
    }
  }

  return (
    <div className="table-container">
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
            const isPending = !!pending[action.id];
            const canDecide =
              action.aiGenerated &&
              action.aiApproved === false &&
              action.status !== "RESOLVED" &&
              action.status !== "CLOSED";

            return (
              <tr key={action.id}>
                <td style={{ maxWidth: 320 }}>
                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem" }}>
                    {action.title}
                    {action.slaBreached && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: "0.7rem",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          padding: "1px 5px",
                          borderRadius: 3,
                          fontWeight: 700,
                        }}
                      >
                        SLA BREACH
                      </span>
                    )}
                  </div>
                  {action.reason && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginTop: 3,
                        whiteSpace: "normal",
                      }}
                    >
                      {action.reason}
                    </div>
                  )}
                  {action.recommendedAction && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#15803d",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      → {action.recommendedAction}
                    </div>
                  )}
                  {error[action.id] && (
                    <div
                      role="alert"
                      style={{
                        fontSize: "0.75rem",
                        color: "#b91c1c",
                        marginTop: 4,
                      }}
                    >
                      {error[action.id]}
                    </div>
                  )}
                </td>
                <td><ModuleBadge module={action.module} /></td>
                <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                  {action.ward ?? "—"}
                </td>
                <td style={{ fontSize: "0.8125rem" }}>{action.assignedDept ?? "—"}</td>
                <td><StatusBadge status={action.status} /></td>
                <td
                  style={{
                    fontSize: "0.8125rem",
                    whiteSpace: "nowrap",
                    color: action.slaBreached ? "#b91c1c" : "#64748b",
                  }}
                >
                  {action.dueAt ? formatDateTime(action.dueAt) : "—"}
                </td>
                <td>
                  {canDecide ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDecision(action.id, "approve")}
                        style={{
                          padding: "4px 8px",
                          background: "#15803d",
                          color: "white",
                          borderRadius: 4,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          border: "none",
                          cursor: isPending ? "wait" : "pointer",
                          opacity: isPending ? 0.6 : 1,
                        }}
                      >
                        {pending[action.id] === "approve" ? "Saving…" : "Approve"}
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDecision(action.id, "reject")}
                        style={{
                          padding: "4px 8px",
                          background: "#ef4444",
                          color: "white",
                          borderRadius: 4,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          border: "none",
                          cursor: isPending ? "wait" : "pointer",
                          opacity: isPending ? 0.6 : 1,
                        }}
                      >
                        {pending[action.id] === "reject" ? "Saving…" : "Reject"}
                      </button>
                    </div>
                  ) : action.aiGenerated ? (
                    <AIIndicator confidence={undefined} />
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
