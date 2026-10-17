"use client";

import { motion } from "motion/react";
import { Package, PackageX, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "../../store/demo-store";
import { createInitialState, stockAlerts } from "../../model/demo-model";
import { Kpi } from "../demo-ui";

const initialStock = Object.fromEntries(createInitialState().products.map((p) => [p.id, p.stock]));

export function InventoryScreen() {
  const data = useDemoStore((s) => s.data);
  const alerts = stockAlerts(data);
  const out = alerts.filter((a) => a.level === "out").length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Productos" icon={Package} value={data.products.length} />
        <Kpi label="Bajo stock" icon={TriangleAlert} tone="warning" value={alerts.length - out} />
        <Kpi label="Sin stock" icon={PackageX} tone="danger" value={out} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead className="bg-muted/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Producto</th>
              <th className="px-3 py-2 font-medium">Categoría</th>
              <th className="px-3 py-2 text-right font-medium">Stock actual</th>
              <th className="px-3 py-2 text-right font-medium">Stock mínimo</th>
              <th className="px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p) => {
              const sold = initialStock[p.id] - p.stock;
              const state = p.stock <= 0 ? "out" : p.stock <= p.min ? "low" : "ok";
              return (
                <motion.tr
                  key={`${p.id}-${p.stock}`}
                  initial={sold > 0 ? { backgroundColor: "var(--lp-brand-soft)" } : false}
                  animate={{ backgroundColor: "rgba(255,255,255,0)" }}
                  transition={{ duration: 1.4 }}
                  className="border-t border-border"
                >
                  <td className="px-3 py-2">
                    <p className="font-medium uppercase">{p.name}</p>
                    {sold > 0 ? <p className="text-[10px] text-primary">−{sold} vendidos hoy</p> : null}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.category}</td>
                  <td className={cn("px-3 py-2 text-right font-semibold tabular-nums", state === "out" && "text-danger")}>
                    {p.stock}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{p.min}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        state === "ok" && "bg-success/10 text-success",
                        state === "low" && "bg-warning/15 text-[oklch(0.5_0.13_70)]",
                        state === "out" && "bg-danger/10 text-danger",
                      )}
                    >
                      {state === "ok" ? "OK" : state === "low" ? "Reponer" : "Sin stock"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
