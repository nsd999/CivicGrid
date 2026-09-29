import { cn, getPriorityBadgeClass, getPriorityLabel, getStatusBadgeClass, getStatusLabel, getModuleLabel, getModuleColor } from "@/lib/utils";
import type { Priority, ActionStatus, Module } from "@/types";

// ============================================================
// PRIORITY BADGE
// ============================================================

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn("badge", className)}
      style={{}}
      aria-label={`Priority: ${getPriorityLabel(priority)}`}
    >
      <span
        className={cn("priority-dot", {
          "priority-dot-critical": priority === "CRITICAL",
          "priority-dot-high": priority === "HIGH",
          "priority-dot-medium": priority === "MEDIUM",
          "priority-dot-low": priority === "LOW",
        })}
      />
      <span
        className={cn("badge", getPriorityBadgeClass(priority))}
        style={{ padding: 0, border: "none", background: "none" }}
      >
        {getPriorityLabel(priority)}
      </span>
    </span>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

interface StatusBadgeProps {
  status: ActionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn("badge", getStatusBadgeClass(status), className)}
      aria-label={`Status: ${getStatusLabel(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

// ============================================================
// MODULE BADGE
// ============================================================

interface ModuleBadgeProps {
  module: Module;
  className?: string;
}

export function ModuleBadge({ module, className }: ModuleBadgeProps) {
  return (
    <span
      className={cn("module-tag", getModuleColor(module), className)}
    >
      {getModuleLabel(module)}
    </span>
  );
}

// ============================================================
// AI INDICATOR
// ============================================================

interface AIIndicatorProps {
  provider?: string;
  confidence?: number;
  className?: string;
}

export function AIIndicator({ provider, confidence, className }: AIIndicatorProps) {
  return (
    <span className={cn("ai-indicator", className)} title="AI-generated recommendation">
      ✦ AI
      {provider && <span style={{ opacity: 0.7 }}>·{provider}</span>}
      {confidence !== undefined && (
        <span style={{ opacity: 0.8 }}>{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}

// ============================================================
// SKELETON
// ============================================================

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{ height: 16, ...style }}
      aria-hidden="true"
    />
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div style={{ marginTop: "1rem" }}>{action}</div>}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, color, className }: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="stat-value" style={color ? { color } : {}}>
            {value}
          </div>
          <div className="stat-label">{label}</div>
        </div>
        {icon && (
          <div style={{ color: color ?? "#94a3b8", opacity: 0.7 }}>{icon}</div>
        )}
      </div>
      {trend && (
        <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#64748b" }}>
          {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)} {trend.label}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  count?: number;
}

export function SectionHeader({ title, description, action, count }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
      <div>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          {title}
          {count !== undefined && (
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "#f1f5f9",
              color: "#64748b",
              padding: "2px 8px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}>
              {count}
            </span>
          )}
        </h2>
        {description && (
          <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#64748b" }}>
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================
// DIVIDER
// ============================================================

export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn(className)}
      style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "1rem 0" }}
    />
  );
}
