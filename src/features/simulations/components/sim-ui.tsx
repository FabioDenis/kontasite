"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small, non-interactive replicas of Konta UI pieces used inside the guided
 * simulations. `simId` marks an element as a cursor target.
 */

export function SimHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {actions ? <div className="flex shrink-0 gap-1.5">{actions}</div> : null}
    </div>
  );
}

export function SimButton({
  children,
  simId,
  variant = "primary",
  pressed = false,
  className,
}: {
  children: React.ReactNode;
  simId?: string;
  variant?: "primary" | "outline" | "danger" | "ghost";
  pressed?: boolean;
  className?: string;
}) {
  return (
    <span
      data-sim={simId}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all duration-150",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "outline" && "border border-border bg-card text-foreground",
        variant === "danger" && "border border-danger/40 bg-danger/5 text-danger",
        variant === "ghost" && "text-foreground",
        pressed && "scale-95 brightness-90",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SimField({
  label,
  value,
  placeholder,
  focused = false,
  simId,
  select = false,
  prefix,
  className,
  highlight = false,
}: {
  label?: string;
  value: string;
  placeholder?: string;
  focused?: boolean;
  simId?: string;
  select?: boolean;
  prefix?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? <p className="mb-1 text-[11px] font-medium text-foreground">{label}</p> : null}
      <div
        data-sim={simId}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-xs transition-colors",
          focused ? "border-primary ring-3 ring-primary/15" : "border-border",
          highlight && "bg-primary/5",
        )}
      >
        {prefix}
        <span className={cn("min-w-0 flex-1 truncate", value ? "text-foreground" : "text-muted-foreground")}>
          {value || placeholder}
          {focused && !select ? <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-foreground" /> : null}
        </span>
        {select ? <ChevronDown className="size-3.5 text-muted-foreground" /> : null}
      </div>
    </div>
  );
}

export function SimSearch({
  value,
  placeholder,
  focused,
  simId,
  hint,
  className = "flex-1",
}: {
  value: string;
  placeholder: string;
  focused?: boolean;
  simId?: string;
  hint?: string;
  /** Defaults to growing inside a row; pass "flex-none" inside a column. */
  className?: string;
}) {
  return (
    <div
      data-sim={simId}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-xs",
        focused ? "border-primary ring-3 ring-primary/15" : "border-border",
        className,
      )}
    >
      <Search className="size-3.5 shrink-0 text-muted-foreground" />
      <span className={cn("min-w-0 flex-1 truncate", value ? "text-foreground" : "text-muted-foreground")}>
        {value || placeholder}
        {focused ? <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-foreground" /> : null}
      </span>
      {hint ? <kbd className="rounded border border-border bg-muted px-1.5 text-[10px]">{hint}</kbd> : null}
    </div>
  );
}

export function SimModal({
  open,
  title,
  description,
  children,
  footer,
  width = 380,
}: {
  open: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          // No backdrop-filter: blurring inside a scaled container mirrors the edges in Chromium.
          className="absolute inset-0 z-30 grid place-items-center bg-[oklch(0.2_0.02_250/0.32)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            style={{ width }}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {title ? (
              <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  {description ? <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{description}</p> : null}
                </div>
                <X className="size-3.5 text-muted-foreground" />
              </div>
            ) : null}
            <div className="px-4 py-3">{children}</div>
            {footer ? <div className="flex justify-end gap-2 border-t border-border bg-card px-4 py-2.5">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SimToast({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs font-medium text-success">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SimBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warning" | "danger" | "success" | "primary" }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap",
        tone === "neutral" && "border border-border bg-card text-secondary-foreground",
        tone === "warning" && "bg-warning/15 text-[oklch(0.52_0.13_70)]",
        tone === "danger" && "bg-danger/10 text-danger",
        tone === "success" && "bg-success/10 text-success",
        tone === "primary" && "bg-primary/10 text-primary",
      )}
    >
      {children}
    </span>
  );
}

export function SimKpi({ label, value, tone = "default", icon: Icon }: { label: string; value: React.ReactNode; tone?: "default" | "danger"; icon?: typeof Search }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5">
      {Icon ? (
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", tone === "danger" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary")}>
          <Icon className="size-3.5" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="line-clamp-2 text-[9px] leading-tight font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-semibold tabular-nums", tone === "danger" && "text-danger")}>{value}</p>
      </div>
    </div>
  );
}

/** Screen wrapper with the same padding rhythm as the app's main area. */
export function SimScreen({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative flex h-full flex-col gap-3 p-5", className)}>{children}</div>;
}
