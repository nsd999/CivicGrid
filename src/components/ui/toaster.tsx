"use client";

import { useState, useEffect } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let globalToasts: Toast[] = [];

export function toast(opts: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const t: Toast = { id, ...opts };
  globalToasts = [...globalToasts, t];
  toastListeners.forEach((fn) => fn(globalToasts));
  // Auto-remove after 4s
  setTimeout(() => {
    globalToasts = globalToasts.filter((x) => x.id !== id);
    toastListeners.forEach((fn) => fn(globalToasts));
  }, 4000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast[]) => setToasts([...t]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 360,
      }}
    >
      {toasts.map((t) => {
        const bg =
          t.variant === "destructive"
            ? "#b91c1c"
            : t.variant === "success"
            ? "#15803d"
            : t.variant === "warning"
            ? "#b45309"
            : "#1e293b";

        return (
          <div
            key={t.id}
            role="alert"
            style={{
              background: bg,
              color: "white",
              padding: "12px 16px",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 600 }}>{t.title}</div>
            {t.description && (
              <div style={{ opacity: 0.9, marginTop: 2, fontSize: 13 }}>
                {t.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
