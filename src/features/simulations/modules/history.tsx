"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, Eye, Printer, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimBadge, SimField, SimHeader, SimScreen, SimSearch } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type Range = "Hoy" | "7 días";

type State = {
  range: Range;
  method: string;
  focus: string;
  menu: boolean;
  pressed: string;
};

type Sale = { date: string; number: number; items: number; customer: string; cashier: string; method: string; total: number; today: boolean };

const sales: Sale[] = [
  { date: "19 de oct, 12:47 a. m.", number: 135, items: 1, customer: "Mostrador", cashier: "fabio", method: "Efectivo", total: 1000, today: true },
  { date: "19 de oct, 12:35 a. m.", number: 134, items: 1, customer: "Mostrador", cashier: "fabio", method: "Efectivo", total: 8000, today: true },
  { date: "18 de oct, 08:20 p. m.", number: 133, items: 3, customer: "Nestor", cashier: "fabio", method: "Cuenta corriente", total: 1233.5, today: false },
  { date: "18 de oct, 06:02 p. m.", number: 132, items: 2, customer: "Mostrador", cashier: "fabio", method: "QR MERCADO PAGO", total: 5100, today: false },
  { date: "17 de oct, 11:41 a. m.", number: 131, items: 1, customer: "Mostrador", cashier: "fabio", method: "Efectivo", total: 1000, today: false },
  { date: "16 de oct, 05:15 p. m.", number: 130, items: 4, customer: "Mostrador", cashier: "fabio", method: "Transferencia", total: 7900, today: false },
];

function visible(s: State) {
  return sales.filter((x) => (s.range === "7 días" || x.today) && (s.method === "Todos los medios" || x.method === s.method));
}

function Screen({ state: s }: { state: State }) {
  const rows = visible(s);
  const total = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <SimScreen>
      <SimHeader title="Historial de Ventas" subtitle="Consultá ventas, revisá cobros y accedé al detalle de cada operación." />
      <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-2">
        <SimSearch value="" placeholder="Buscar venta o cliente" />
        <div className="flex rounded-lg bg-muted p-0.5 text-[10px]">
          {(["Hoy", "7 días", "Este mes"] as const).map((r) => (
            <span
              key={r}
              data-sim={`range-${r}`}
              className={cn("rounded-md px-2 py-1 font-medium whitespace-nowrap", s.range === r ? "bg-primary text-white" : "text-secondary-foreground")}
            >
              {r}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10px] whitespace-nowrap text-muted-foreground">
          <CalendarDays className="size-3" /> {s.range === "Hoy" ? "19/10" : "13/10"} → 19/10
        </span>
        <SimField simId="method" value={s.method} select focused={s.focus === "method"} className="w-32" />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
        <div>
          <p className="text-xs font-semibold">{rows.length} ventas encontradas</p>
          <p className="text-[10px] text-muted-foreground">Resultados ordenados desde la venta más reciente.</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Período filtrado</p>
          <p className="text-xs font-semibold tabular-nums">Total: {money(total)}</p>
        </div>
      </div>

      <div className="relative rounded-xl border border-border bg-card text-[11px]">
        <div className="grid grid-cols-[1.4fr_1.3fr_0.9fr_1.1fr_0.9fr_0.8fr] gap-2 px-3 py-2 font-medium">
          <span>Fecha y hora</span>
          <span>Venta</span>
          <span>Cliente</span>
          <span>Medio de pago</span>
          <span className="text-right">Total</span>
          <span />
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r, i) => (
            <motion.div
              key={r.number}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="grid grid-cols-[1.4fr_1.3fr_0.9fr_1.1fr_0.9fr_0.8fr] items-center gap-2 border-t border-border px-3 py-1.5"
            >
              <span className="truncate text-muted-foreground">{r.date}</span>
              <span className="flex items-center gap-1 font-semibold whitespace-nowrap">
                Venta #{String(r.number).padStart(6, "0")}
                <SimBadge>{r.items} prod.</SimBadge>
              </span>
              <span className="truncate">{r.customer}</span>
              <SimBadge tone={r.method === "Efectivo" ? "neutral" : r.method === "Cuenta corriente" ? "warning" : "primary"}>{r.method}</SimBadge>
              <span className="text-right font-semibold tabular-nums">{money(r.total)}</span>
              <span className="flex justify-end">
                <span
                  data-sim={i === 0 ? "actions" : undefined}
                  className={cn("inline-flex items-center gap-0.5 rounded-md border border-border px-1.5 py-0.5 text-[10px]", i === 0 && s.menu && "bg-muted")}
                >
                  Acciones <ChevronDown className="size-3" />
                </span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {s.menu ? (
            <motion.ul
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-[60px] z-10 w-40 rounded-lg border border-border bg-card p-1 shadow-lg"
            >
              <li data-sim="detail" className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", s.pressed === "detail" && "bg-primary/10 text-primary")}>
                <Eye className="size-3.5" /> Ver detalle
              </li>
              <li className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <ReceiptText className="size-3.5" /> Ver ticket
              </li>
              <li className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <Printer className="size-3.5" /> Reimprimir ticket
              </li>
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </SimScreen>
  );
}

export const historySimulation: Simulation<State> = {
  id: "history",
  module: "Historial de Ventas",
  title: "Encontrá cualquier venta.",
  accent: "En segundos.",
  text: "Filtrá por fecha, medio de pago, cliente o cajero. Cada venta guarda su detalle y su ticket, para cuando un cliente vuelve con una duda.",
  steps: [
    "Elegí el período: hoy, 7 días o el mes",
    "Filtrá por medio de pago",
    "Abrí el detalle o el ticket de una venta",
  ],
  initial: { range: "Hoy", method: "Todos los medios", focus: "", menu: false, pressed: "" },
  frames: [
    { step: 0, duration: 1000, target: "range-7 días" },
    { step: 0, duration: 450, target: "range-7 días", click: true },
    { step: 0, duration: 1700, set: { range: "7 días" } },
    { step: 1, duration: 900, target: "method", click: true, set: { focus: "method" } },
    { step: 1, duration: 1900, set: { method: "Efectivo", focus: "" } },
    { step: 2, duration: 900, target: "actions" },
    { step: 2, duration: 450, target: "actions", click: true },
    { step: 2, duration: 800, target: "detail", set: { menu: true } },
    { step: 2, duration: 2600, target: "detail", set: { pressed: "detail" } },
  ],
  Screen,
};
