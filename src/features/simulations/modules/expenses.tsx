"use client";

import { motion } from "motion/react";
import { Landmark, Plus, ReceiptText, Tag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimBadge, SimButton, SimField, SimHeader, SimKpi, SimModal, SimScreen } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type State = {
  modal: boolean;
  description: string;
  category: string;
  amount: string;
  focus: string;
  paid: boolean;
  source: "" | "caja" | "fuera";
  pressed: string;
  saved: boolean;
};

function Radio({ on, label, hint, simId }: { on: boolean; label: string; hint: string; simId: string }) {
  return (
    <div data-sim={simId} className="flex gap-2 py-1">
      <span className={cn("mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full border", on ? "border-primary" : "border-border")}>
        {on ? <span className="size-2 rounded-full bg-primary" /> : null}
      </span>
      <div>
        <p className="text-[11px] font-medium">{label}</p>
        <p className="text-[9px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function ExpenseRow({ name, date, fresh = false }: { name: string; date: string; fresh?: boolean }) {
  return (
    <motion.div
      initial={fresh ? { opacity: 0, y: -8, backgroundColor: "var(--lp-brand-soft)" } : false}
      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(255,255,255,0)" }}
      transition={{ duration: 0.5, backgroundColor: { duration: 2 } }}
      className="grid grid-cols-[1.2fr_0.9fr_0.8fr_1.2fr_0.9fr] items-center gap-2 border-t border-border px-3 py-2 text-xs"
    >
      <span className="font-medium">{name}</span>
      <SimBadge>Insumos</SimBadge>
      <span className="text-muted-foreground">{date}</span>
      <div>
        <p>Efectivo</p>
        <SimBadge>Efectivo {money(10000)}</SimBadge>
      </div>
      <span className="text-right font-semibold tabular-nums">{money(10000)}</span>
    </motion.div>
  );
}

function Screen({ state: s }: { state: State }) {
  const count = s.saved ? 2 : 1;

  return (
    <SimScreen>
      <SimHeader
        title="Gastos"
        subtitle="Registrá y controlá los egresos del negocio."
        actions={
          <SimButton simId="new" pressed={s.pressed === "new"}>
            <Plus className="size-3.5" /> Nuevo gasto
          </SimButton>
        }
      />
      <div className="grid grid-cols-4 gap-2">
        <SimKpi icon={Landmark} label="Total del periodo" value={money(count * 10000)} />
        <SimKpi icon={ReceiptText} label="Cantidad de gastos" value={count} />
        <SimKpi icon={Tag} label="Categoría principal" value="Insumos" />
        <SimKpi icon={Wallet} label="Medio más usado" value="Efectivo" />
      </div>
      {s.saved ? <p className="text-xs text-muted-foreground">Gasto registrado.</p> : null}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-3 pt-3 pb-2">
          <p className="text-sm font-semibold">Listado de gastos</p>
          <p className="text-[10px] text-muted-foreground">Revisá el período actual, la categoría y cómo se pagó cada egreso.</p>
        </div>
        <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_1.2fr_0.9fr] gap-2 bg-muted/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Gasto</span>
          <span>Categoría</span>
          <span>Fecha</span>
          <span>Medio de pago</span>
          <span className="text-right">Monto</span>
        </div>
        {s.saved ? <ExpenseRow fresh name="Proveedor 2" date="19/10/2026" /> : null}
        <ExpenseRow name="Proveedor 1" date="18/10/2026" />
      </div>

      <SimModal
        open={s.modal}
        width={410}
        title="Nuevo gasto"
        description="Cargá descripción, categoría, monto y fecha. Después definí si el pago sale por un solo medio o en combinación."
        footer={
          <>
            <SimButton variant="outline">Cancelar</SimButton>
            <SimButton simId="save" pressed={s.pressed === "save"}>
              Registrar gasto
            </SimButton>
          </>
        }
      >
        <div className="space-y-2">
          <SimField label="Descripción" simId="description" value={s.description} focused={s.focus === "description"} />
          <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2">
            <SimField label="Categoría" simId="category" value={s.category} placeholder="Seleccionar" select focused={s.focus === "category"} />
            <SimField label="Monto" simId="amount" value={s.amount} focused={s.focus === "amount"} />
            <SimField label="Fecha" value="19/10/2026" />
          </div>
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="flex justify-between text-[11px]">
              <span className="font-medium">Medios de pago</span>
              <span className="text-muted-foreground">Pago simple</span>
            </div>
            {s.paid ? (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mt-1.5 flex items-center justify-between rounded-md border border-border px-2 py-1.5 text-[11px]">
                  <span className="font-medium">Efectivo</span>
                  <span className="tabular-nums">{money(10000)}</span>
                  <span className="text-[10px]">Quitar</span>
                </div>
                <div className="mt-1 flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{money(10000)} de {money(10000)}</span>
                  <span className="font-medium text-success">Completo</span>
                </div>
              </motion.div>
            ) : (
              <div className="mt-1.5 grid grid-cols-[1fr_0.7fr_auto] gap-1.5">
                <SimField simId="method" value="" placeholder="Medio" select />
                <SimField value="" placeholder="Monto" />
                <SimButton variant="outline" className="text-[10px]">Agregar</SimButton>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card px-2 py-1.5">
            <p className="mb-0.5 text-[11px] font-medium">¿De dónde sale la plata?</p>
            <Radio simId="source-caja" on={s.source === "caja"} label="Caja del turno" hint="Abrí la caja para pagar desde el cajón" />
            <Radio
              simId="source-fuera"
              on={s.source === "fuera"}
              label="Efectivo por fuera de la caja"
              hint="Por ejemplo, plata del dueño o de la caja fuerte. No cambia el arqueo."
            />
          </div>
        </div>
      </SimModal>
    </SimScreen>
  );
}

export const expensesSimulation: Simulation<State> = {
  id: "expenses",
  module: "Gastos",
  title: "Registrá tus gastos.",
  accent: "Y sabé en qué se va la plata.",
  text: "Proveedores, servicios, insumos. Cada gasto queda con su categoría y su medio de pago, y decidís si sale de la caja del turno o por fuera.",
  steps: [
    "Tocá “Nuevo gasto”",
    "Cargá descripción, categoría y monto",
    "Elegí con qué lo pagaste",
    "Indicá de dónde sale la plata",
    "Registrá el gasto",
  ],
  initial: {
    modal: false,
    description: "",
    category: "",
    amount: "",
    focus: "",
    paid: false,
    source: "",
    pressed: "",
    saved: false,
  },
  frames: [
    { step: 0, duration: 1000, target: "new" },
    { step: 0, duration: 450, target: "new", click: true, set: { pressed: "new" } },
    { step: 1, duration: 500, target: "description", set: { modal: true, pressed: "", focus: "description" } },
    { step: 1, duration: 1000, type: { key: "description", text: "Proveedor 2" } },
    { step: 1, duration: 600, target: "category", click: true, set: { focus: "category" } },
    { step: 1, duration: 500, set: { category: "Insumos" } },
    { step: 1, duration: 400, target: "amount", set: { focus: "amount" } },
    { step: 1, duration: 700, type: { key: "amount", text: "10000" } },
    { step: 2, duration: 700, target: "method", click: true, set: { focus: "" } },
    { step: 2, duration: 1000, set: { paid: true } },
    { step: 3, duration: 700, target: "source-fuera" },
    { step: 3, duration: 1100, target: "source-fuera", click: true, set: { source: "fuera" } },
    { step: 4, duration: 700, target: "save" },
    { step: 4, duration: 450, target: "save", click: true, set: { pressed: "save" } },
    { step: 4, duration: 3200, set: { modal: false, saved: true, pressed: "" } },
  ],
  Screen,
};
