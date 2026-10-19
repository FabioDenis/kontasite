"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatARS } from "../model/demo-model";

/** Number that counts from its previous value to the new one. */
export function AnimatedAmount({
  value,
  format = formatARS,
  className,
}: {
  value: number;
  format?: (value: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, format, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}

export function ScreenHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-border pb-3">
      <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
    </div>
  );
}

export function Kpi({
  label,
  value,
  helper,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }[tone];

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 text-lg font-semibold text-foreground sm:text-xl">{value}</p>
        {helper ? <p className="mt-1 text-[11px] text-muted-foreground">{helper}</p> : null}
      </div>
      {Icon ? (
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", toneClass)}>
          <Icon className="size-4" />
        </span>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-3 sm:p-4", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
