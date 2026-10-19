"use client";

import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimScreen } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type Range = "7 días" | "30 días";

type State = {
  range: Range;
  hover: string;
  /** 0..2 vertical pan through the report. */
  scroll: number;
};

const data: Record<Range, { net: number; ops: number; ticket: number; units: number; series: number[] }> = {
  "7 días": { net: 34200, ops: 6, ticket: 5700, units: 11, series: [2, 1, 4, 3, 2, 6, 9] },
  "30 días": {
    net: 101733,
    ops: 20,
    ticket: 5087,
    units: 37,
    series: [1, 0, 2, 1, 0, 5, 1, 0, 0, 12, 4, 1, 0, 1, 2, 0, 1, 3, 1, 0, 1, 2, 1, 0, 1, 3, 1, 2, 1, 4],
  },
};

const methods = [
  { label: "Efectivo", value: 69733, share: 0.6855, ops: 11, color: "var(--chart-1)" },
  { label: "QR MERCADO PAGO", value: 20800, share: 0.2045, ops: 6, color: "var(--chart-2)" },
  { label: "Transferencia", value: 7900, share: 0.0777, ops: 2, color: "var(--chart-3)" },
  { label: "Tarjeta debito", value: 3300, share: 0.0324, ops: 1, color: "var(--chart-4)" },
];

const topProducts = [
  { name: "Fiambrería", units: "2 u.", value: 48433, share: "47,6%" },
  { name: "Arroz 1kg", units: "15 u.", value: 15000, share: "14,7%" },
  { name: "Galletitas Pepas Membrillo", units: "4 u.", value: 8000, share: "7,9%" },
  { name: "Varios", units: "3 u.", value: 6000, share: "5,9%" },
];

function AreaChart({ series }: { series: number[] }) {
  const w = 600;
  const h = 110;
  const max = Math.max(...series, 1);
  const pts = series.map((v, i) => [(w * i) / (series.length - 1), h - 6 - ((h - 12) * v) / max]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[110px] w-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--border)" strokeDasharray="4 4" />
      ))}
      <motion.path key={`a-${series.length}`} d={area} fill="var(--chart-1)" fillOpacity="0.12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.path
        key={`l-${series.length}`}
        d={line}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </svg>
  );
}

function Screen({ state: s }: { state: State }) {
  const d = data[s.range];
  const kpis = [
    { label: "Ventas netas", value: money(d.net), tone: "text-[oklch(0.55_0.16_60)]" },
    { label: "Operaciones", value: String(d.ops), tone: "" },
    { label: "Ticket promedio", value: money(d.ticket), tone: "" },
    { label: "Unidades vendidas", value: String(d.units), tone: "" },
  ];

  return (
    <SimScreen className="overflow-hidden">
      <motion.div animate={{ y: -s.scroll * 150 }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }} className="flex flex-col gap-2.5">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Reportes</h3>
          <p className="text-xs text-muted-foreground">Información clara para entender y decidir.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card p-0.5 text-[10px]">
            {(["Hoy", "7 días", "30 días", "90 días"] as const).map((r) => (
              <span key={r} data-sim={`range-${r}`} className={cn("rounded-md px-2.5 py-1 font-medium", s.range === r ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground")}>
                {r}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground">
            <CalendarDays className="size-3" /> {s.range === "7 días" ? "13/10/2026" : "20/09/2026"} – 19/10/2026
          </span>
        </div>
        <div className="flex gap-4 border-b border-border text-[11px]">
          {["Resumen", "Ventas", "Resultados", "Inventario", "Cuentas por cobrar"].map((t) => (
            <span key={t} className={cn("pb-1.5", t === "Ventas" ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground")}>
              {t}
            </span>
          ))}
        </div>
        <div data-sim="kpis" className={cn("grid grid-cols-4 overflow-hidden rounded-xl border bg-card", s.hover === "kpis" ? "border-primary" : "border-border")}>
          {kpis.map((k) => (
            <div key={k.label} className="border-r border-border px-3 py-2 last:border-0">
              <p className="text-[10px] text-muted-foreground">{k.label}</p>
              <motion.p key={`${s.range}-${k.label}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-1 text-right text-base font-semibold tabular-nums", k.tone)}>
                {k.value}
              </motion.p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <p className="text-xs font-semibold">Evolución de ventas</p>
          <AreaChart series={d.series} />
        </div>
        <div data-sim="methods" className={cn("rounded-xl border bg-card px-3 py-2", s.hover === "methods" ? "border-primary" : "border-border")}>
          <p className="text-xs font-semibold">Ventas por forma de cobro</p>
          <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-muted">
            {methods.map((m, i) => (
              <motion.div
                key={m.label}
                className="h-full shrink-0 origin-left"
                style={{ width: `${m.share * 100}%`, backgroundColor: m.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: s.scroll >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              />
            ))}
          </div>
          <ul className="mt-2 space-y-1 text-[10px]">
            {methods.map((m) => (
              <li key={m.label} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="flex-1">{m.label}</span>
                <span className="font-medium tabular-nums">{money(m.value)}</span>
                <span className="w-24 text-right text-muted-foreground">
                  {(m.share * 100).toFixed(2).replace(".", ",")}% · {m.ops} op.
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div data-sim="top" className={cn("rounded-xl border bg-card px-3 py-2", s.hover === "top" ? "border-primary" : "border-border")}>
          <p className="text-xs font-semibold">Top productos vendidos</p>
          <ul className="mt-1.5 text-[10px]">
            {topProducts.map((p, i) => (
              <li key={p.name} className="grid grid-cols-[18px_1.6fr_0.6fr_0.8fr_0.5fr] items-center gap-2 border-t border-border py-1.5">
                <span className="text-muted-foreground">{i + 1}</span>
                <span className="truncate font-medium">{p.name}</span>
                <span className="text-muted-foreground">{p.units}</span>
                <span className="text-right tabular-nums">{money(p.value)}</span>
                <span className="text-right text-muted-foreground">{p.share}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </SimScreen>
  );
}

export const reportsSimulation: Simulation<State> = {
  id: "reports",
  module: "Reportes",
  title: "Mirá tus números.",
  accent: "Sin planillas.",
  text: "Ventas del día, la semana o el mes. Ticket promedio, cómo te pagan, lo que más se vende, tus gastos y lo que te deben.",
  steps: [
    "Elegí el período",
    "Ventas netas, operaciones y ticket promedio",
    "Cómo te pagan tus clientes",
    "Lo que más se vende",
  ],
  initial: { range: "7 días", hover: "", scroll: 0 },
  frames: [
    { step: 0, duration: 1000, target: "range-30 días" },
    { step: 0, duration: 450, target: "range-30 días", click: true },
    { step: 0, duration: 1800, set: { range: "30 días" } },
    { step: 1, duration: 2600, target: "kpis", set: { hover: "kpis" } },
    { step: 2, duration: 600, set: { hover: "", scroll: 1 } },
    { step: 2, duration: 2600, target: "methods", set: { hover: "methods" } },
    { step: 3, duration: 600, set: { hover: "", scroll: 2 } },
    { step: 3, duration: 3000, target: "top", set: { hover: "top" } },
  ],
  Screen,
};
