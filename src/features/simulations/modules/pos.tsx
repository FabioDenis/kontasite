"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, LayoutGrid, Minus, Plus, ReceiptText, ShoppingCart, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimButton, SimField, SimModal, SimScreen, SimSearch } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type State = {
  query: string;
  focus: string;
  dropdown: boolean;
  inCart: boolean;
  modal: "" | "pay" | "done";
  method: string;
  amount: string;
  pressed: string;
};

const methods = [
  { key: "1", label: "Efectivo" },
  { key: "2", label: "Tarjeta debito" },
  { key: "3", label: "Tarjeta credito" },
  { key: "4", label: "Transferencia" },
  { key: "6", label: "QR MERCADO PAGO" },
];

const categories = ["Varios", "Bazar", "Bebidas con alcohol", "Farmacia", "Fiambrería", "Mercaderias", "Bebidas"];

function Screen({ state: s }: { state: State }) {
  const total = s.inCart ? 1000 : 0;

  return (
    <SimScreen className="flex-row gap-3">
      <div className="relative flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-card p-3">
        <SimSearch simId="search" value={s.query} placeholder="Buscar producto por nombre o código…" focused={s.focus === "search"} hint="F2" className="flex-none" />
        <AnimatePresence>
          {s.dropdown ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-3 top-[52px] z-10 rounded-lg border border-border bg-card p-1 shadow-lg"
            >
              <div data-sim="result" className={cn("flex items-center justify-between rounded-md bg-primary/10 px-2.5 py-2", s.pressed === "result" && "brightness-95")}>
                <div>
                  <p className="text-xs font-medium">Gaseosa Cola 1.5L</p>
                  <p className="text-[9px] text-muted-foreground">Código: P-000660 · Barras: 7790000000543</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">{money(1000)}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px]">Stock: 12</span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {s.inCart ? (
          <div className="mt-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-medium">
              <ShoppingCart className="size-3.5 text-primary" /> Carrito
              <span className="ml-auto grid size-4 place-items-center rounded-full bg-primary text-[9px] text-white">1</span>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10, backgroundColor: "var(--lp-brand-soft)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
              transition={{ duration: 0.4, backgroundColor: { duration: 1.6 } }}
              className="flex items-center gap-2 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">Gaseosa Cola 1.5L</p>
                <p className="text-[9px] text-muted-foreground">Unitario: {money(1000)} · 1/12 en carrito</p>
              </div>
              <span className="grid size-6 place-items-center rounded-full border border-border text-muted-foreground">
                <Minus className="size-3" />
              </span>
              <span className="w-4 text-center text-xs">1</span>
              <span className="grid size-6 place-items-center rounded-full border border-border">
                <Plus className="size-3" />
              </span>
              <span className="w-20 text-right text-xs font-semibold tabular-nums">{money(1000)}</span>
              <Trash2 className="size-3.5 text-muted-foreground" />
            </motion.div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center text-center text-[11px] text-muted-foreground">
            <div>
              <span className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-muted">
                <ShoppingCart className="size-4" />
              </span>
              Buscá y agregá productos
              <br />
              para comenzar la venta
            </div>
          </div>
        )}
      </div>

      <div className="flex w-52 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-2.5">
        <SimField value="" placeholder="Buscar cliente por nombre…" prefix={<User className="size-3.5 text-muted-foreground" />} />
        <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium">
          <LayoutGrid className="size-3.5 text-primary" /> Venta rápida
        </p>
        <div className="grid grid-cols-2 gap-1">
          {categories.map((c, i) => (
            <span key={c} className="flex items-center justify-between rounded-md border border-border px-1.5 py-1 text-[9px]">
              <span className="truncate">{c}</span>
              <span className="flex items-center text-muted-foreground">
                {i + 1}
                <ChevronRight className="size-2.5" />
              </span>
            </span>
          ))}
        </div>
        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-primary/5 px-2.5 py-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total</span>
            <span className="text-lg font-semibold text-primary tabular-nums">{money(total)}</span>
          </div>
          <SimButton
            simId="charge"
            pressed={s.pressed === "charge"}
            className={cn("h-9 w-full", !s.inCart && "bg-primary/30")}
          >
            <ShoppingCart className="size-3.5" /> Cobrar {s.inCart ? money(total) : ""}
            {s.inCart ? <kbd className="rounded bg-white/20 px-1 text-[9px]">F4</kbd> : null}
          </SimButton>
        </div>
      </div>

      <SimModal
        open={s.modal === "pay"}
        width={340}
        title="Cobrar"
        footer={
          <>
            <SimButton variant="ghost">Cancelar</SimButton>
            <SimButton simId="finish" pressed={s.pressed === "finish"} className="flex-1">
              Finalizar venta <kbd className="rounded bg-white/20 px-1 text-[9px]">F8</kbd>
            </SimButton>
          </>
        }
      >
        <div className="flex items-baseline justify-between rounded-lg border border-border bg-card px-3 py-2">
          <span className="text-xl font-semibold tabular-nums">{money(1000)}</span>
          <span className="text-[10px] text-muted-foreground">total</span>
        </div>
        <ul className="mt-2 overflow-hidden rounded-lg border border-border bg-card">
          {methods.map((m) => (
            <li
              key={m.key}
              data-sim={`method-${m.key}`}
              className={cn(
                "flex items-center gap-2 border-b border-border px-2.5 py-1.5 text-[11px] last:border-0",
                s.method === m.label && "bg-primary/10 font-medium text-primary",
              )}
            >
              <span className="grid size-4 place-items-center rounded border border-border bg-muted text-[8px] text-muted-foreground">{m.key}</span>
              {m.label}
              {s.method === m.label ? <Check className="ml-auto size-3.5" /> : null}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Monto para <span className="font-semibold text-foreground">{s.method || "…"}</span>
        </p>
        <div className="mt-1 flex gap-1.5">
          <SimField simId="amount" value={s.amount ? `$ ${s.amount}` : ""} placeholder="$" focused={s.focus === "amount"} className="flex-1" />
          <SimButton variant="outline" className="text-[10px]">Restante</SimButton>
          <SimButton>Agregar</SimButton>
        </div>
      </SimModal>

      <SimModal open={s.modal === "done"} width={300}>
        <div className="flex flex-col items-center pt-2 text-center">
          <motion.span
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="grid size-12 place-items-center rounded-full bg-success/10 text-success ring-2 ring-success/40"
          >
            <Check className="size-6" />
          </motion.span>
          <p className="mt-3 text-base font-semibold">¡Venta registrada!</p>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-card p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold tabular-nums">{money(1000)}</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Medios de pago</p>
          <div className="flex justify-between">
            <span>Efectivo</span>
            <span className="text-muted-foreground tabular-nums">{money(1000)}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SimButton variant="outline" className="h-9">
            <ReceiptText className="size-3.5" /> Ver ticket
          </SimButton>
          <SimButton className="h-9 ring-3 ring-primary/30">Nueva venta</SimButton>
        </div>
        <p className="mt-2 text-center text-[9px] text-muted-foreground">Flechas para elegir · Enter para confirmar</p>
      </SimModal>
    </SimScreen>
  );
}

export const posSimulation: Simulation<State> = {
  id: "pos",
  module: "Punto de Venta",
  title: "Vendé rápido.",
  accent: "Sin filas en el mostrador.",
  text: "Buscás por nombre o pasás el lector de código de barras. Elegís cómo te pagan, incluso combinando medios, y la venta queda registrada al instante.",
  steps: [
    "Buscá el producto o pasá el lector (F2)",
    "Agregalo al carrito",
    "Tocá Cobrar (F4)",
    "Elegí el medio de pago y el monto",
    "Finalizá la venta (F8)",
  ],
  initial: { query: "", focus: "", dropdown: false, inCart: false, modal: "", method: "", amount: "", pressed: "" },
  frames: [
    { step: 0, duration: 900, target: "search" },
    { step: 0, duration: 400, target: "search", click: true, set: { focus: "search" } },
    { step: 0, duration: 1100, type: { key: "query", text: "Gaseosa co" } },
    { step: 1, duration: 500, set: { dropdown: true } },
    { step: 1, duration: 700, target: "result" },
    { step: 1, duration: 450, target: "result", click: true, set: { pressed: "result" } },
    { step: 1, duration: 1300, set: { dropdown: false, inCart: true, query: "", focus: "", pressed: "" } },
    { step: 2, duration: 900, target: "charge" },
    { step: 2, duration: 450, target: "charge", click: true, set: { pressed: "charge" } },
    { step: 3, duration: 700, target: "method-1", set: { modal: "pay", pressed: "" } },
    { step: 3, duration: 500, target: "method-1", click: true },
    { step: 3, duration: 400, target: "amount", set: { method: "Efectivo", focus: "amount" } },
    { step: 3, duration: 700, type: { key: "amount", text: "1000" } },
    { step: 4, duration: 800, target: "finish", set: { focus: "" } },
    { step: 4, duration: 450, target: "finish", click: true, set: { pressed: "finish" } },
    { step: 4, duration: 3400, set: { modal: "done", pressed: "" } },
  ],
  Screen,
};
