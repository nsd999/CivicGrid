"use client";

import { useState } from "react";
import { PriorityBadge, StatusBadge, ModuleBadge, AIIndicator } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { Action } from "@/types";

export function ActionClientTable({ initialActions }: { initialActions: Action[] }) {
  const [actions, setActions] = useState<Action[]>(initialActions);

  const handleApprove = (id: string) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, aiApproved: true, status: "ASSIGNED" } : a
    ));
  };

  const handleReject = (id: string) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, aiApproved: false, status: "RESOLVED" } : a
    ));
  };

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
          {actions.map((action) => (
            <tr key={action.id}>
              <td style={{ maxWidth: 320 }}>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem" }}>
                  {action.title}
                  {action.slaBreached && (
                    <span style={{
                      marginLeft: 6,
                      fontSize: "0.7rem",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontWeight: 700,
                    }}>
                      SLA BREACH
                    </span>
                  )}
                </div>
                {action.reason && (
                  <div style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: 3,
                    whiteSpace: "normal",
                  }}>
                    {action.reason}
                  </div>
                )}
                {action.recommendedAction && (
                  <div style={{
                    fontSize: "0.75rem",
                    color: "#15803d",
                    marginTop: 4,
                    fontStyle: "italic",
                  }}>
                    → {action.recommendedAction}
                  </div>
                )}
              </td>
              <td><ModuleBadge module={action.module} /></td>
              <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                {action.ward ?? "—"}
              </td>
              <td style={{ fontSize: "0.8125rem" }}>{action.assignedDept ?? "—"}</td>
              <td><StatusBadge status={action.status} /></td>
              <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap", color: action.slaBreached ? "#b91c1c" : "#64748b" }}>
                {action.dueAt ? formatDateTime(action.dueAt) : "—"}
              </td>
              <td>
                {action.aiGenerated && action.aiApproved === false && action.status !== "RESOLVED" ? (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button 
                      onClick={() => handleApprove(action.id)}
                      style={{ padding: "4px 8px", background: "#15803d", color: "white", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: "pointer" }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(action.id)}
                      style={{ padding: "4px 8px", background: "#ef4444", color: "white", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: "pointer" }}
                    >
                      Reject
                    </button>
                  </div>
                ) : action.aiGenerated ? (
                  <AIIndicator confidence={undefined} />
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Manual</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
