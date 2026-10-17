"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "../store/demo-store";
import { demoModules, type ModuleId } from "../modules";
import { formatSaleNumber } from "../model/demo-model";
import { ScreenHeader } from "./demo-ui";
import { PosScreen } from "./screens/pos-screen";
import { DashboardScreen } from "./screens/dashboard-screen";
import { CashScreen } from "./screens/cash-screen";
import { InventoryScreen } from "./screens/inventory-screen";
import { CustomersScreen } from "./screens/customers-screen";
import { ReportsScreen } from "./screens/reports-screen";

const screens: Record<ModuleId, React.ComponentType> = {
  dashboard: DashboardScreen,
  pos: PosScreen,
  cash: CashScreen,
  inventory: InventoryScreen,
  customers: CustomersScreen,
  reports: ReportsScreen,
};

function SaleToast() {
  const lastSale = useDemoStore((s) => s.data.lastSaleNumber);
  const open = useDemoStore((s) => s.open);
  const active = useDemoStore((s) => s.active);

  // Hide the toast after a few seconds; adding a product also clears it.
  useEffect(() => {
    if (lastSale === null) return;
    const t = setTimeout(() => useDemoStore.setState((s) => ({ data: { ...s.data, lastSaleNumber: null } })), 6000);
    return () => clearTimeout(t);
  }, [lastSale]);

  return (
    <AnimatePresence>
      {lastSale !== null && active === "pos" ? (
        <motion.div
          key={lastSale}
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-[var(--brand-sidebar)] px-4 py-3 text-white shadow-2xl sm:inset-x-auto sm:right-4 sm:max-w-md"
        >
          <CircleCheck className="size-5 shrink-0 text-[oklch(0.75_0.16_155)]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Venta {formatSaleNumber(lastSale)} registrada</p>
            <p className="text-xs text-white/60">Caja, stock y reportes ya se actualizaron.</p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => open("inventory")}
              className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/20"
            >
              Ver stock
            </button>
            <button
              type="button"
              onClick={() => open("dashboard")}
              className="rounded-md bg-[var(--accent-primary)] px-2 py-1 text-xs font-medium hover:brightness-110"
            >
              Ver números
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Interactive replica of the Konta app shell, fed by the demo store. */
export function DemoWindow({ className }: { className?: string }) {
  const active = useDemoStore((s) => s.active);
  const changed = useDemoStore((s) => s.changed);
  const open = useDemoStore((s) => s.open);
  const reset = useDemoStore((s) => s.reset);
  const reduce = useReducedMotion();
  const current = demoModules.find((m) => m.id === active)!;
  const Screen = screens[active];

  return (
    <div
      className={cn(
        "konta-app overflow-hidden rounded-2xl border border-black/10 bg-background shadow-[0_40px_80px_-40px_rgba(10,16,32,.45)] ring-1 ring-black/5",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto w-full max-w-xs truncate rounded-md bg-muted px-3 py-1 text-center text-[11px] text-muted-foreground">
          app.konta.com.ar/{current.id}
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Reiniciar la demo"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>

      <div className="flex h-[640px] sm:h-[600px]">
        {/* Sidebar (desktop) — same styling as the Konta app shell */}
        <aside
          className="hidden w-52 shrink-0 flex-col border-r border-[var(--sidebar-border)] lg:flex"
          style={{ background: "var(--brand-sidebar)" }}
        >
          <div className="flex items-center gap-2 px-4 pt-5 pb-2">
            <Image src="/konta-isotype.png" alt="" width={28} height={28} className="size-7" />
            <span className="text-base font-bold text-[var(--accent-primary)]">Konta</span>
            <span className="text-sm text-white/80">Studio</span>
          </div>
          <div className="mx-3 my-3 h-px bg-white/10" />
          <nav className="flex-1 space-y-1 px-3" aria-label="Módulos de la demo">
            {demoModules.map((m) => {
              const isActive = m.id === active;
              const hasNews = changed.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => open(m.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive ? "bg-white/12 text-white shadow-sm shadow-black/10" : "text-white/70 hover:bg-white/8 hover:text-white",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="demo-active-bar"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent-primary)]"
                    />
                  ) : null}
                  <m.icon size={18} />
                  {m.label}
                  {hasNews ? (
                    <span className="ml-auto size-2 rounded-full bg-[var(--accent-primary)] animate-ring" aria-label="Novedades" />
                  ) : null}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-white/10 px-3 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-white">
                M
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Marta</p>
                <p className="truncate text-xs text-white/50">Almacén Don Pedro</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Module tabs (mobile / tablet) */}
          <nav
            className="flex gap-1.5 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden"
            aria-label="Módulos de la demo"
          >
            {demoModules.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => open(m.id)}
                aria-current={m.id === active ? "page" : undefined}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                  m.id === active ? "bg-[var(--brand-sidebar)] text-white" : "bg-muted text-secondary-foreground",
                )}
              >
                <m.icon className="size-3.5" />
                {m.label}
                {changed.includes(m.id) ? <span className="size-1.5 rounded-full bg-primary" /> : null}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex h-full flex-col gap-3"
              >
                <ScreenHeader title={current.title} subtitle={current.subtitle} />
                <div className="flex-1">
                  <Screen />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <SaleToast />
        </div>
      </div>
    </div>
  );
}
