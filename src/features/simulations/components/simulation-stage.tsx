"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  Package,
  Pause,
  Play,
  Receipt,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AnySimulation, SimulationId } from "../engine/types";
import type { TimelinePlayer } from "../engine/use-timeline-player";

/** Fixed design size of the simulated screen; it is scaled to fit its container. */
export const STAGE_WIDTH = 720;
export const STAGE_HEIGHT = 470;

const sidebar: { id: SimulationId | "dashboard"; icon: typeof Package; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Vista General" },
  { id: "products", icon: ShoppingBag, label: "Productos" },
  { id: "inventory", icon: Package, label: "Inventario" },
  { id: "pos", icon: DollarSign, label: "Punto de Venta" },
  { id: "history", icon: ReceiptText, label: "Historial de Ventas" },
  { id: "cash", icon: Wallet, label: "Caja" },
  { id: "customers", icon: Users, label: "Clientes" },
  { id: "expenses", icon: Receipt, label: "Gastos" },
  { id: "reports", icon: BarChart3, label: "Reportes" },
];

function useScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => setScale(node.clientWidth / STAGE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return scale;
}

function Cursor({
  screenRef,
  target,
  click,
  scale,
  frameKey,
}: {
  screenRef: React.RefObject<HTMLDivElement | null>;
  target: string | null;
  click: boolean;
  scale: number;
  /** Changes on every animation tick so the target is re-measured while things move. */
  frameKey: number;
}) {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: STAGE_WIDTH * 0.7, y: STAGE_HEIGHT * 0.8 });

  // Re-measure on every tick: modals and lists move while animating.
  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen || !target) return;
    const el = screen.querySelector<HTMLElement>(`[data-sim="${target}"]`);
    if (!el) return;
    const s = screen.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = (r.left - s.left + Math.min(r.width * 0.6, r.width - 8)) / scale;
    const y = (r.top - s.top + r.height * 0.6) / scale;
    if (Math.abs(x - pos.x) > 1 || Math.abs(y - pos.y) > 1) setPos({ x, y });
  }, [screenRef, target, scale, pos.x, pos.y, frameKey]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-50"
      animate={{ x: pos.x, y: pos.y, scale: click ? 0.85 : 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
    >
      <AnimatePresence>
        {click ? (
          <motion.span
            key="ripple"
            className="absolute -left-4 -top-4 size-8 rounded-full bg-[var(--accent-primary)]/35"
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) : null}
      </AnimatePresence>
      <svg width="22" height="24" viewBox="0 0 22 24" className="drop-shadow-[0_2px_3px_rgba(0,0,0,.35)]">
        <path d="M2 2l7.5 19 2.6-7.6L20 11z" fill="#0a1020" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

type SimulationStageProps = {
  simulation: AnySimulation;
  player: TimelinePlayer<unknown>;
  className?: string;
};

/** Scaled replica of the Konta window with a guided cursor and step captions. */
export function SimulationStage({ simulation, player, className }: SimulationStageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const scale = useScale(outerRef);
  const { Screen } = simulation;
  const stepCount = simulation.steps.length;

  return (
    <div className={cn("konta-app overflow-hidden rounded-2xl border border-black/10 bg-card shadow-[0_30px_60px_-30px_rgba(10,16,32,.45)]", className)}>
      <div ref={outerRef} className="relative w-full overflow-hidden" style={{ height: STAGE_HEIGHT * scale }}>
        <div
          ref={screenRef}
          className="absolute left-0 top-0 flex origin-top-left bg-background"
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
        >
          {/* Collapsed Konta sidebar */}
          <aside
            className="flex w-14 shrink-0 flex-col items-center gap-1.5 border-r border-[var(--sidebar-border)] py-3"
            style={{ background: "var(--brand-sidebar)" }}
            aria-hidden
          >
            <Image src="/konta-isotype.png" alt="" width={26} height={26} className="mb-2 size-6" />
            {sidebar.map((item) => (
              <span
                key={item.id}
                className={cn(
                  "relative grid size-9 place-items-center rounded-lg",
                  item.id === simulation.id ? "bg-white/12 text-white" : "text-white/55",
                )}
              >
                {item.id === simulation.id ? (
                  <span className="absolute -left-2.5 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent-primary)]" />
                ) : null}
                <item.icon size={17} />
              </span>
            ))}
          </aside>
          {/* Remount on every lap so exit animations from the previous lap do not overlap the restart. */}
          <motion.div
            key={player.loop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative min-w-0 flex-1 overflow-hidden"
          >
            <Screen state={player.state} />
          </motion.div>
          <Cursor
            screenRef={screenRef}
            target={player.target}
            click={player.click}
            scale={scale}
            frameKey={player.index + player.progress}
          />
        </div>
      </div>

      {/* Captions and controls (not scaled, so they stay readable on phones) */}
      <div className="flex items-center gap-3 border-t border-border bg-card px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex gap-1" aria-hidden>
            {simulation.steps.map((step, i) => (
              <span key={step} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full origin-left rounded-full bg-primary"
                  style={{
                    transform: `scaleX(${i < player.step ? 1 : i === player.step ? player.stepProgress : 0})`,
                  }}
                />
              </span>
            ))}
          </div>
          <p className="mt-2 truncate text-sm font-medium text-foreground" aria-live="polite">
            <span className="text-muted-foreground">
              Paso {player.step + 1} de {stepCount} ·{" "}
            </span>
            {simulation.steps[player.step]}
          </p>
        </div>
        <button
          type="button"
          onClick={player.togglePause}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-foreground hover:bg-muted"
          aria-label={player.paused ? "Reanudar simulación" : "Pausar simulación"}
        >
          {player.paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button
          type="button"
          onClick={player.restart}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-foreground hover:bg-muted"
          aria-label="Repetir desde el principio"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  );
}
