"use client";

import { AnimatePresence, motion } from "motion/react";
import { History, Package, PackageX, ScanLine, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimBadge, SimButton, SimField, SimHeader, SimKpi, SimScreen, SimSearch } from "../components/sim-ui";
import type { Simulation } from "../engine/types";

type State = {
  query: string;
  focus: string;
  status: "" | "Sin stock";
  hover: string;
};

type Item = { name: string; code: string; category: string; stock: number; min: number; priority: "Media" | "Alta" };

const items: Item[] = [
  { name: "Gaseosa Cola 1.5L", code: "P-000660  7790000000543", category: "Bebida sin Alcohol", stock: 12, min: 4, priority: "Media" },
  { name: "Arroz 1kg", code: "ARROZ-1KG  7790000000011", category: "Mercaderias", stock: 18, min: 6, priority: "Media" },
  { name: "Cerveza Lata 473ml", code: "P-000612  7790000000710", category: "Bebidas", stock: 0, min: 12, priority: "Alta" },
  { name: "Jugo Naranja 1L", code: "P-000618  7790000000734", category: "Bebidas", stock: 0, min: 8, priority: "Alta" },
  { name: "Yerba 500g", code: "YERBA-500G  7790000000059", category: "Mercaderias", stock: 3, min: 5, priority: "Media" },
];

function visible(s: State) {
  const q = s.query.trim().toLowerCase();
  return items.filter((i) => (!q || i.name.toLowerCase().startsWith(q)) && (!s.status || i.stock === 0));
}

function Screen({ state: s }: { state: State }) {
  const rows = visible(s);
  const out = rows.filter((r) => r.stock === 0).length;
  const low = rows.filter((r) => r.stock > 0 && r.stock <= r.min).length;

  return (
    <SimScreen>
      <SimHeader
        title="Inventario"
        subtitle="Monitoreo de productos con control de stock, alertas y ajustes auditados."
        actions={
          <>
            <SimButton>
              <ScanLine className="size-3.5" /> Ajustar stock
            </SimButton>
            <SimButton variant="outline">
              <History className="size-3.5" /> Historial de ajustes
            </SimButton>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-2">
        <SimKpi icon={Package} label="Productos filtrados" value={rows.length} />
        <SimKpi icon={TriangleAlert} label="Bajo stock" value={low} />
        <SimKpi icon={PackageX} label="Sin stock" value={out} tone={out ? "danger" : "default"} />
      </div>
      <div className="flex gap-2 rounded-xl border border-border bg-card p-2">
        <SimSearch simId="search" value={s.query} placeholder="Buscar por nombre, código o código de barras…" focused={s.focus === "search"} />
        <SimField simId="status" value={s.status || "Todos los estados"} select focused={s.focus === "status"} className="w-36" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card text-xs">
        <div className="grid grid-cols-[1.7fr_1.1fr_0.7fr_0.7fr_0.6fr_0.6fr] gap-2 bg-muted/60 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Producto</span>
          <span>Categoría</span>
          <span className="text-right">Stock actual</span>
          <span className="text-right">Stock mínimo</span>
          <span>Prioridad</span>
          <span>Estado</span>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r) => (
            <motion.div
              key={r.name}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-[1.7fr_1.1fr_0.7fr_0.7fr_0.6fr_0.6fr] items-center gap-2 border-t border-border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{r.name}</p>
                <p className="truncate text-[9px] text-muted-foreground">{r.code}</p>
              </div>
              <span className="truncate">{r.category}</span>
              <span
                data-sim={r.name === "Gaseosa Cola 1.5L" ? "stock" : undefined}
                className={cn(
                  "rounded px-1 text-right font-semibold tabular-nums transition-colors",
                  r.stock === 0 && "text-danger",
                  s.hover === "stock" && r.name === "Gaseosa Cola 1.5L" && "bg-primary/10",
                )}
              >
                {r.stock}
              </span>
              <span
                data-sim={r.name === "Gaseosa Cola 1.5L" ? "min" : undefined}
                className={cn(
                  "rounded px-1 text-right tabular-nums text-muted-foreground transition-colors",
                  s.hover === "min" && r.name === "Gaseosa Cola 1.5L" && "bg-primary/10 text-foreground",
                )}
              >
                {r.min}
              </span>
              <SimBadge tone={r.priority === "Alta" ? "danger" : "warning"}>{r.priority}</SimBadge>
              {r.stock === 0 ? (
                <SimBadge tone="danger">Sin stock</SimBadge>
              ) : r.stock <= r.min ? (
                <SimBadge tone="warning">Bajo</SimBadge>
              ) : (
                <span className="font-medium">OK</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SimScreen>
  );
}

export const inventorySimulation: Simulation<State> = {
  id: "inventory",
  module: "Inventario",
  title: "Controlá el stock.",
  accent: "Sin decir “no me queda”.",
  text: "Cada venta descuenta stock sola. Buscás cualquier producto y ves cuánto te queda; Konta te marca lo que está por debajo del mínimo.",
  steps: [
    "Buscá un producto por nombre o código",
    "Mirá su stock actual y el mínimo",
    "Filtrá lo que te falta reponer",
  ],
  initial: { query: "", focus: "", status: "", hover: "" },
  frames: [
    { step: 0, duration: 1000, target: "search" },
    { step: 0, duration: 400, target: "search", click: true, set: { focus: "search" } },
    { step: 0, duration: 1500, type: { key: "query", text: "Gaseosa cola" } },
    { step: 1, duration: 1400, target: "stock", set: { focus: "", hover: "stock" } },
    { step: 1, duration: 1600, target: "min", set: { hover: "min" } },
    { step: 2, duration: 500, set: { hover: "", query: "" } },
    { step: 2, duration: 900, target: "status", click: true, set: { focus: "status" } },
    { step: 2, duration: 3600, set: { status: "Sin stock", focus: "" } },
  ],
  Screen,
};
