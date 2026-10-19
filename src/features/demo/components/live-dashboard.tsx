"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  BadgePercent,
  BarChart3,
  CalendarDays,
  CircleCheck,
  DollarSign,
  LayoutDashboard,
  Package,
  PackagePlus,
  Receipt,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addToCart,
  averageTicket,
  checkout,
  createInitialState,
  expectedCash,
  formatARS,
  formatSaleNumber,
  stockAlerts,
  todaySales,
  topSellers,
  weekSeries,
  type CheckoutInput,
  type DemoState,
  type PaymentMethod,
} from "../model/demo-model";
import { AnimatedAmount, Kpi, Panel } from "./demo-ui";
import { SalesLineChart } from "./sales-line-chart";

type Order = { cart: Record<string, number> } & CheckoutInput;

/** The day the panel replays: every few seconds the next order comes in. */
const orders: Order[] = [
  { cart: { coca: 2 }, method: "efectivo" },
  { cart: { yerba: 1, galletitas: 1 }, method: "transferencia" },
  { cart: { alfajor: 2, agua: 1 }, method: "efectivo" },
  { cart: { pan: 1 }, method: "cuenta", customerId: "marta" },
  { cart: { detergente: 1, fideos: 2 }, method: "tarjeta" },
  { cart: { coca: 1, alfajor: 1 }, method: "efectivo" },
  { cart: { yerba: 1 }, method: "efectivo" },
  { cart: { pan: 1 }, method: "efectivo" },
];

const FIRST_SALE_MS = 1400;
const SALE_EVERY_MS = 3200;
const RESTART_PAUSE_MS = 4500;

const methodLabels: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  cuenta: "Cuenta corriente",
};

const sidebar = [
  { label: "Vista General", icon: LayoutDashboard },
  { label: "Productos", icon: ShoppingBag },
  { label: "Inventario", icon: Package },
  { label: "Punto de Venta", icon: DollarSign },
  { label: "Historial de Ventas", icon: ReceiptText },
  { label: "Caja", icon: Wallet },
  { label: "Clientes", icon: Users },
  { label: "Gastos", icon: Receipt },
  { label: "Reportes", icon: BarChart3 },
  { label: "Beneficios", icon: BadgePercent },
];

const dayLabels = ["sáb", "dom", "lun", "mar", "mié", "jue", "hoy"];

function applyOrder(state: DemoState, order: Order): DemoState {
  let next = state;
  for (const [id, qty] of Object.entries(order.cart)) {
    for (let i = 0; i < qty; i++) next = addToCart(next, id);
  }
  return checkout(next, order);
}

/** Replays a day of sales on the real Konta "Vista General" while it is on screen. */
function useLiveDay(active: boolean) {
  const [state, setState] = useState(createInitialState);
  const [played, setPlayed] = useState(0);

  useEffect(() => {
    if (!active) return;
    const finished = played >= orders.length;
    const delay = finished ? RESTART_PAUSE_MS : played === 0 ? FIRST_SALE_MS : SALE_EVERY_MS;
    const timer = setTimeout(() => {
      if (finished) {
        setState(createInitialState());
        setPlayed(0);
      } else {
        setState((s) => applyOrder(s, orders[played]));
        setPlayed((n) => n + 1);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [active, played]);

  return state;
}

const TOAST_MS = 2400;

function SaleToast({ state }: { state: DemoState }) {
  const latest = state.lastSaleNumber !== null ? state.sales[0] : null;
  const [dismissed, setDismissed] = useState<number | null>(null);

  useEffect(() => {
    if (!latest) return;
    const timer = setTimeout(() => setDismissed(latest.number), TOAST_MS);
    return () => clearTimeout(timer);
  }, [latest]);

  const sale = latest && latest.number !== dismissed ? latest : null;
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-20 w-64">
      <AnimatePresence>
        {sale ? (
          <motion.div
            key={sale.number}
            role="status"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xl"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success/10 text-success">
              <CircleCheck className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">Venta {formatSaleNumber(sale.number)}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {methodLabels[sale.method]}
                {sale.method === "cuenta" ? ` · ${sale.customer}` : ""}
              </p>
            </div>
            <span className="text-sm font-semibold tabular-nums">{formatARS(sale.total)}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function LiveDashboard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const state = useLiveDay(inView && !reduce);

  const series = weekSeries(state);
  const alerts = stockAlerts(state);
  const sellers = topSellers(state).slice(0, 4);
  const maxUnits = Math.max(...sellers.map((s) => s.units), 1);

  return (
    <div
      ref={ref}
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
          app.konta.com.ar/dashboard
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-danger">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-danger" />
          </span>
          En vivo
        </span>
      </div>

      <div className="flex h-[680px] sm:h-[640px]" aria-label="Panel de Konta actualizándose con cada venta">
        {/* Konta sidebar */}
        <aside
          className="hidden w-52 shrink-0 flex-col border-r border-[var(--sidebar-border)] lg:flex"
          style={{ background: "var(--brand-sidebar)" }}
          aria-hidden
        >
          <div className="flex items-center gap-2 px-4 pt-5 pb-2">
            <Image src="/konta-isotype.png" alt="" width={28} height={28} className="size-7" />
            <span className="text-base font-bold text-[var(--accent-primary)]">Konta</span>
            <span className="text-sm text-white/80">Studio</span>
          </div>
          <div className="mx-3 my-3 h-px bg-white/10" />
          <nav className="flex-1 space-y-0.5 px-3">
            {sidebar.map((item, i) => (
              <span
                key={item.label}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium",
                  i === 0 ? "bg-white/12 text-white" : "text-white/65",
                )}
              >
                {i === 0 ? (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent-primary)]" />
                ) : null}
                <item.icon size={17} />
                {item.label}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 border-t border-white/10 px-3 py-3">
            <span className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-white">
              M
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Marta</p>
              <p className="truncate text-xs text-white/50">Almacén Don Pedro</p>
            </div>
          </div>
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden p-4 sm:p-5">
          <SaleToast state={state} />

          <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">Vista General</h3>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">Control rápido de ventas, stock y actividad del negocio.</p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground md:inline-flex">
              <CalendarDays className="size-3.5" /> 19 de octubre de 2026
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            <Kpi label="Ventas hoy" icon={DollarSign} value={<AnimatedAmount value={todaySales(state)} />} helper={`${state.sales.length} ventas`} />
            <Kpi
              label="Esta semana"
              icon={TrendingUp}
              value={<AnimatedAmount value={series.reduce((a, b) => a + b, 0)} />}
              helper="Últimos 7 días"
            />
            <Kpi label="Ticket promedio" icon={CalendarDays} value={<AnimatedAmount value={averageTicket(state)} />} helper="Día en curso" />
            <Kpi label="Caja actual" icon={Wallet} value={<AnimatedAmount value={expectedCash(state)} />} helper="Caja abierta en curso" />
          </div>

          <div className="mt-3 hidden flex-wrap gap-2 text-xs font-medium sm:flex" aria-hidden>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-primary-foreground">
              <ShoppingCart className="size-3.5" /> Nueva venta
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1.5">
              <Receipt className="size-3.5" /> Registrar gasto
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1.5">
              <Wallet className="size-3.5" /> Ver caja
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1.5">
              <PackagePlus className="size-3.5" /> Nuevo producto
            </span>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(220px,1fr)]">
            <Panel title="Ventas — Últimos 7 días" description="Lectura rápida de la evolución comercial reciente.">
              <SalesLineChart values={series} labels={dayLabels} className="h-auto w-full" />
            </Panel>

            <Panel title="Atención requerida" description="Lo que necesita tu atención ahora.">
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {alerts.length === 0 ? (
                    <motion.li key="ok" className="flex items-center gap-2 text-xs text-success">
                      <CircleCheck className="size-4" /> Todo en orden
                    </motion.li>
                  ) : (
                    alerts.slice(0, 3).map((alert) => (
                      <motion.li
                        key={`${alert.id}-${alert.level}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-lg border border-border p-2"
                      >
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-lg",
                            alert.level === "out" ? "bg-danger/10 text-danger" : "bg-warning/15 text-warning",
                          )}
                        >
                          <TriangleAlert className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{alert.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {alert.level === "out" ? "Sin stock" : `Quedan ${alert.stock} u.`}
                          </p>
                        </div>
                      </motion.li>
                    ))
                  )}
                </AnimatePresence>
              </ul>
            </Panel>
          </div>

          <div className="mt-3 hidden gap-3 md:grid md:grid-cols-2">
            <Panel title="Productos más vendidos" description="Lo que más salió hoy.">
              {sellers.length === 0 ? (
                <p className="py-3 text-xs text-muted-foreground">Esperando la primera venta…</p>
              ) : (
                <ul className="space-y-2">
                  {sellers.map((p, i) => (
                    <motion.li key={p.id} layout className="text-xs">
                      <div className="flex justify-between">
                        <span className="truncate font-medium">
                          <span className="mr-1.5 text-muted-foreground">#{i + 1}</span>
                          {p.name}
                        </span>
                        <span className="tabular-nums">{p.units} u.</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full origin-left rounded-full bg-primary"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: p.units / maxUnits }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Últimas ventas" description="Cada venta queda registrada al instante.">
              <ul className="divide-y divide-border text-xs">
                <AnimatePresence initial={false}>
                  {state.sales.slice(0, 4).map((sale) => (
                    <motion.li
                      key={sale.number}
                      layout
                      initial={{ opacity: 0, backgroundColor: "var(--lp-brand-soft)" }}
                      animate={{ opacity: 1, backgroundColor: "rgba(255,255,255,0)" }}
                      transition={{ duration: 0.8 }}
                      className="flex items-center justify-between gap-2 py-1.5"
                    >
                      <span className="font-medium">Venta {formatSaleNumber(sale.number)}</span>
                      <span className="text-muted-foreground">{methodLabels[sale.method]}</span>
                      <span className="font-semibold tabular-nums">{formatARS(sale.total)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
