"use client";

import { motion } from "motion/react";
import { Check, Download, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimBadge, SimButton, SimField, SimHeader, SimModal, SimScreen, SimToast } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type State = {
  modal: boolean;
  name: string;
  barcode: string;
  category: string;
  cost: string;
  price: string;
  stockOn: boolean;
  stock: string;
  min: string;
  focus: string;
  pressed: string;
  saved: boolean;
};

const catalog = [
  { name: "Lenteja", code: "12412342", internal: "P-000658", price: 1200, cost: 600 },
  { name: "Yerba 500g", code: "7790000000059", internal: "YERBA-500G", price: 1150, cost: 800 },
  { name: "Aceite 1L", code: "7790000000042", internal: "ACEITE-1L", price: 1750, cost: 1200 },
  { name: "Azucar 1kg", code: "7790000000035", internal: "AZUCAR-1KG", price: 980, cost: 650 },
];

function Row({ name, code, internal, category, price, cost, fresh = false }: { name: string; code: string; internal: string; category: string; price: number; cost: number; fresh?: boolean }) {
  return (
    <motion.div
      layout
      initial={fresh ? { opacity: 0, y: -10, backgroundColor: "var(--lp-brand-soft)" } : false}
      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(255,255,255,0)" }}
      transition={{ duration: 0.6, backgroundColor: { duration: 2.2 } }}
      className="grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr] items-center gap-2 border-t border-border px-3 py-2"
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="font-mono text-[9px] text-muted-foreground">{code}</p>
        <p className="font-mono text-[9px] text-muted-foreground">Código interno: {internal}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        <SimBadge>{category}</SimBadge>
        <SimBadge>Unitario</SimBadge>
      </div>
      <div>
        <p className="text-xs font-medium tabular-nums">Venta: {money(price)}</p>
        <p className="text-[10px] text-muted-foreground tabular-nums">Costo: {money(cost)}</p>
      </div>
      <SimBadge tone="warning">Media</SimBadge>
    </motion.div>
  );
}

function Screen({ state: s }: { state: State }) {
  return (
    <SimScreen>
      <SimHeader
        title="Productos"
        subtitle="Gestiona tu catálogo de productos, incluyendo qué ítems controlan stock operativo."
        actions={
          <>
            <SimButton simId="new" pressed={s.pressed === "new"}>
              <Plus className="size-3.5" /> Nuevo producto
            </SimButton>
            <SimButton variant="outline">
              <Upload className="size-3.5" /> Importar Excel
            </SimButton>
            <SimButton variant="outline">
              <Download className="size-3.5" /> Exportar Excel
            </SimButton>
          </>
        }
      />
      <SimToast show={s.saved}>Producto creado correctamente.</SimToast>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr] gap-2 bg-muted/60 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Prioridad</span>
        </div>
        {s.saved ? (
          <Row fresh name="Gaseosa Cola 1.5L" code="7790000000543" internal="P-000660" category="Bebida sin Alcohol" price={1000} cost={500} />
        ) : null}
        {catalog.slice(0, s.saved ? 3 : 4).map((p) => (
          <Row key={p.name} {...p} category="Mercaderias" />
        ))}
      </div>

      <SimModal
        open={s.modal}
        width={400}
        title="Nuevo producto"
        description="Completa los campos para agregar un nuevo producto al catálogo."
        footer={
          <>
            <SimButton variant="outline">Cancelar</SimButton>
            <SimButton simId="save" pressed={s.pressed === "save"}>
              Guardar producto
            </SimButton>
          </>
        }
      >
        <div className="space-y-2">
          <SimField label="Nombre *" simId="name" value={s.name} focused={s.focus === "name"} highlight={Boolean(s.name)} />
          <div className="grid grid-cols-2 gap-2">
            <SimField label="Código de barras" simId="barcode" value={s.barcode} focused={s.focus === "barcode"} />
            <SimField label="Categoría" simId="category" value={s.category} placeholder="Seleccionar" focused={s.focus === "category"} select />
          </div>
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="grid grid-cols-2 gap-2">
              <SimField label="Precio de costo *" simId="cost" value={s.cost} focused={s.focus === "cost"} />
              <SimField label="Precio de venta *" simId="price" value={s.price} focused={s.focus === "price"} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-2">
            <span data-sim="stockOn" className="inline-flex items-center gap-1.5 text-[11px] font-medium">
              <span
                className={cn(
                  "grid size-3.5 place-items-center rounded-[4px] border transition-colors",
                  s.stockOn ? "border-primary bg-primary text-white" : "border-border bg-card",
                )}
              >
                {s.stockOn ? <Check className="size-2.5" strokeWidth={3} /> : null}
              </span>
              Controlar stock
            </span>
            <div className={cn("mt-2 grid grid-cols-2 gap-2 transition-opacity", !s.stockOn && "opacity-40")}>
              <SimField label="Stock actual *" simId="stock" value={s.stock} focused={s.focus === "stock"} />
              <SimField label="Stock mínimo *" simId="min" value={s.min} focused={s.focus === "min"} />
            </div>
          </div>
        </div>
      </SimModal>
    </SimScreen>
  );
}

export const productsSimulation: Simulation<State> = {
  id: "products",
  module: "Productos",
  title: "Cargá tus productos.",
  accent: "Una sola vez.",
  text: "Nombre, código de barras, precio de costo y de venta. Si querés, también el stock mínimo para que Konta te avise cuándo reponer.",
  steps: [
    "Tocá “Nuevo producto”",
    "Completá nombre, código de barras y categoría",
    "Cargá el precio de costo y el de venta",
    "Activá el control de stock con su mínimo",
    "Guardá: ya está en tu catálogo",
  ],
  initial: {
    modal: false,
    name: "",
    barcode: "",
    category: "",
    cost: "",
    price: "",
    stockOn: false,
    stock: "",
    min: "",
    focus: "",
    pressed: "",
    saved: false,
  },
  frames: [
    { step: 0, duration: 1100, target: "new" },
    { step: 0, duration: 450, target: "new", click: true, set: { pressed: "new" } },
    { step: 1, duration: 500, target: "name", set: { modal: true, pressed: "", focus: "name" } },
    { step: 1, duration: 1500, type: { key: "name", text: "Gaseosa Cola 1.5L" } },
    { step: 1, duration: 450, target: "barcode", set: { focus: "barcode" } },
    { step: 1, duration: 1300, type: { key: "barcode", text: "7790000000543" } },
    { step: 1, duration: 600, target: "category", click: true, set: { focus: "category" } },
    { step: 1, duration: 600, set: { category: "Bebida sin Alcohol", focus: "" } },
    { step: 2, duration: 450, target: "cost", set: { focus: "cost" } },
    { step: 2, duration: 600, type: { key: "cost", text: "500" } },
    { step: 2, duration: 450, target: "price", set: { focus: "price" } },
    { step: 2, duration: 700, type: { key: "price", text: "1000" } },
    { step: 3, duration: 650, target: "stockOn", click: true, set: { focus: "" } },
    { step: 3, duration: 300, set: { stockOn: true } },
    { step: 3, duration: 400, target: "stock", set: { focus: "stock" } },
    { step: 3, duration: 500, type: { key: "stock", text: "12" } },
    { step: 3, duration: 400, target: "min", set: { focus: "min" } },
    { step: 3, duration: 500, type: { key: "min", text: "4" } },
    { step: 4, duration: 700, target: "save", set: { focus: "" } },
    { step: 4, duration: 450, target: "save", click: true, set: { pressed: "save" } },
    { step: 4, duration: 3400, set: { modal: false, saved: true, pressed: "" } },
  ],
  Screen,
};
