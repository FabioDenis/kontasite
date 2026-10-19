"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, DollarSign, MoreVertical, Percent, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimBadge, SimButton, SimField, SimHeader, SimKpi, SimModal, SimScreen, SimSearch } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type State = {
  filter: "Todos" | "Con deuda";
  panel: boolean;
  modal: boolean;
  value: string;
  focus: string;
  applied: boolean;
  pressed: string;
};

const BASE = 1633.5;
const RATE = 5;
const SURCHARGE = Math.round(BASE * RATE) / 100;

const movements = [
  { label: "Compra · Venta #000133", date: "18/10", amount: 1233.5 },
  { label: "Pago en efectivo", date: "10/10", amount: -500 },
  { label: "Compra · Venta #000098", date: "01/10", amount: 900 },
];

function Screen({ state: s }: { state: State }) {
  const balance = s.applied ? BASE + SURCHARGE : BASE;
  const rows = [
    { name: "Nestor", contact: "324234", balance },
    { name: "Jose", contact: "2312312", balance: 0 },
  ].filter((r) => s.filter === "Todos" || r.balance > 0);

  return (
    <SimScreen>
      <SimHeader title="Clientes" subtitle="Gestión de clientes y cuentas corrientes." actions={<SimButton>+ Nuevo cliente</SimButton>} />
      <div className="grid grid-cols-3 gap-2">
        <SimKpi icon={Users} label="Total clientes" value={2} />
        <SimKpi icon={CircleAlert} label="Con deuda" value={1} tone="danger" />
        <SimKpi icon={DollarSign} label="Saldo pendiente total" value={money(balance)} tone="danger" />
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
        <SimSearch value="" placeholder="Buscar por nombre, documento o teléfono…" />
        <div className="flex rounded-lg bg-muted p-0.5 text-[10px]">
          {(["Todos", "Con deuda", "Cuenta activa"] as const).map((f) => (
            <span
              key={f}
              data-sim={`filter-${f}`}
              className={cn("rounded-md px-2 py-1 font-medium", s.filter === f ? "bg-primary text-white" : "text-secondary-foreground")}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card text-xs">
        <div className="grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.3fr] gap-2 bg-muted/60 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>Cliente</span>
          <span>Contacto</span>
          <span>Cuenta</span>
          <span className="text-right">Saldo</span>
          <span />
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r) => (
            <motion.div
              key={r.name}
              layout
              exit={{ opacity: 0 }}
              data-sim={`row-${r.name}`}
              className={cn(
                "grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.3fr] items-center gap-2 border-t border-border px-3 py-2.5",
                s.panel && r.name === "Nestor" && "bg-primary/5",
              )}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-muted-foreground">{r.contact}</span>
              <SimBadge>Cuenta corriente</SimBadge>
              <span className={cn("text-right font-semibold tabular-nums", r.balance > 0 && "text-danger")}>{money(r.balance)}</span>
              <MoreVertical className="ml-auto size-3.5 text-muted-foreground" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Customer detail sheet */}
      <AnimatePresence>
        {s.panel ? (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-y-0 right-0 z-20 flex w-[330px] flex-col gap-3 border-l border-border bg-background p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold">Nestor</p>
                <p className="text-[10px] text-muted-foreground">Tel. 324234 · Cuenta corriente</p>
              </div>
              <X className="size-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-3 text-xs">
              <div data-sim="balance">
                <p className="text-muted-foreground">Saldo pendiente</p>
                <motion.p key={balance} initial={{ scale: 1.15, color: "var(--accent-primary)" }} animate={{ scale: 1, color: "var(--danger)" }} className="origin-left text-lg font-semibold tabular-nums">
                  {money(balance)}
                </motion.p>
              </div>
              <div data-sim="overdue" className="text-right">
                <p className="text-muted-foreground">Días de mora</p>
                <p className="text-lg font-semibold">18</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-xs">
              <p className="font-semibold">Movimientos de cuenta</p>
              <ul data-sim="movements" className="mt-1.5">
                {s.applied ? (
                  <motion.li
                    initial={{ opacity: 0, backgroundColor: "var(--lp-brand-soft)" }}
                    animate={{ opacity: 1, backgroundColor: "rgba(255,255,255,0)" }}
                    transition={{ backgroundColor: { duration: 2 } }}
                    className="flex justify-between border-t border-border py-1.5"
                  >
                    <span>Recargo por mora (5%)</span>
                    <span className="font-medium tabular-nums">+ {money(SURCHARGE)}</span>
                  </motion.li>
                ) : null}
                {movements.map((m) => (
                  <li key={m.label} className="flex justify-between border-t border-border py-1.5">
                    <span>
                      {m.label} <span className="text-muted-foreground">· {m.date}</span>
                    </span>
                    <span className={cn("font-medium tabular-nums", m.amount < 0 && "text-success")}>
                      {m.amount > 0 ? "+ " : ""}
                      {money(m.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex gap-2">
              <SimButton variant="outline" className="flex-1">
                Registrar pago
              </SimButton>
              <SimButton simId="surcharge" variant="danger" pressed={s.pressed === "surcharge"} className="flex-1">
                <Percent className="size-3.5" /> Aplicar recargo
              </SimButton>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <SimModal
        open={s.modal}
        width={320}
        title="Aplicar recargo"
        description="Desde el débito pendiente más antiguo"
        footer={
          <>
            <SimButton variant="outline">Cancelar</SimButton>
            <SimButton simId="apply" pressed={s.pressed === "apply"}>
              Aplicar recargo
            </SimButton>
          </>
        }
      >
        <p className="mb-1 text-[11px] font-medium">Tipo de recargo</p>
        <div className="mb-2 grid grid-cols-2 rounded-lg bg-muted p-0.5 text-[11px]">
          <span className="rounded-md bg-card py-1 text-center font-medium shadow-sm">Porcentaje</span>
          <span className="py-1 text-center text-muted-foreground">Monto fijo</span>
        </div>
        <SimField label="Valor" simId="value" value={s.value ? `${s.value} %` : ""} placeholder="%" focused={s.focus === "value"} />
        <div className="mt-2 space-y-1 rounded-lg border border-border bg-card p-2.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saldo base</span>
            <span className="tabular-nums">{money(BASE)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recargo</span>
            <span className="tabular-nums">{s.value ? `+ ${money(SURCHARGE)}` : money(0)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1 font-semibold">
            <span>Nuevo saldo</span>
            <span className="tabular-nums">{money(s.value ? BASE + SURCHARGE : BASE)}</span>
          </div>
        </div>
      </SimModal>
    </SimScreen>
  );
}

export const customersSimulation: Simulation<State> = {
  id: "customers",
  module: "Clientes",
  title: "Anotá el fiado.",
  accent: "Sin cuaderno.",
  text: "Vendés a cuenta corriente a tus clientes de confianza. Ves quién debe, cuánto y hace cuántos días, y si hace falta aplicás un recargo por mora.",
  steps: [
    "Filtrá los clientes con deuda",
    "Abrí la cuenta del cliente",
    "Mirá saldo, días de mora y movimientos",
    "Aplicá un recargo por mora",
  ],
  initial: { filter: "Todos", panel: false, modal: false, value: "", focus: "", applied: false, pressed: "" },
  frames: [
    { step: 0, duration: 1000, target: "filter-Con deuda" },
    { step: 0, duration: 450, target: "filter-Con deuda", click: true },
    { step: 0, duration: 1200, set: { filter: "Con deuda" } },
    { step: 1, duration: 800, target: "row-Nestor" },
    { step: 1, duration: 450, target: "row-Nestor", click: true },
    { step: 2, duration: 1100, target: "balance", set: { panel: true } },
    { step: 2, duration: 1100, target: "overdue" },
    { step: 2, duration: 1400, target: "movements" },
    { step: 3, duration: 800, target: "surcharge" },
    { step: 3, duration: 450, target: "surcharge", click: true, set: { pressed: "surcharge" } },
    { step: 3, duration: 400, target: "value", set: { modal: true, pressed: "", focus: "value" } },
    { step: 3, duration: 500, type: { key: "value", text: "5" } },
    { step: 3, duration: 800, target: "apply", set: { focus: "" } },
    { step: 3, duration: 450, target: "apply", click: true, set: { pressed: "apply" } },
    { step: 3, duration: 3000, target: "balance", set: { modal: false, applied: true, pressed: "" } },
  ],
  Screen,
};
