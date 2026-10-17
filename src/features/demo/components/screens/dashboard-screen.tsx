"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CircleCheck, DollarSign, TrendingUp, TriangleAlert, Wallet } from "lucide-react";
import { useDemoStore } from "../../store/demo-store";
import {
  averageTicket,
  expectedCash,
  formatARS,
  stockAlerts,
  todaySales,
  weekSeries,
} from "../../model/demo-model";
import { AnimatedAmount, Kpi, Panel } from "../demo-ui";
import { SalesLineChart } from "../sales-line-chart";

const dayLabels = ["sáb", "dom", "lun", "mar", "mié", "jue", "hoy"];

export function DashboardScreen() {
  const data = useDemoStore((s) => s.data);
  const open = useDemoStore((s) => s.open);
  const series = weekSeries(data);
  const alerts = stockAlerts(data);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <Kpi label="Ventas hoy" icon={DollarSign} value={<AnimatedAmount value={todaySales(data)} />} helper="Día en curso" />
        <Kpi
          label="Esta semana"
          icon={TrendingUp}
          value={<AnimatedAmount value={series.reduce((a, b) => a + b, 0)} />}
          helper="Últimos 7 días"
        />
        <Kpi
          label="Ticket promedio"
          icon={CalendarDays}
          value={<AnimatedAmount value={averageTicket(data)} />}
          helper={`${data.sales.length} ventas hoy`}
        />
        <Kpi label="Caja actual" icon={Wallet} value={<AnimatedAmount value={expectedCash(data)} />} helper="Caja abierta en curso" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(220px,1fr)]">
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
                alerts.map((alert) => (
                  <motion.li
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2 rounded-lg border border-border p-2"
                  >
                    <span
                      className={
                        alert.level === "out"
                          ? "grid size-7 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger"
                          : "grid size-7 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning"
                      }
                    >
                      <TriangleAlert className="size-3.5" />
                    </span>
                    <div className="min-w-0">
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
          <button
            type="button"
            onClick={() => open("inventory")}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            Revisar stock →
          </button>
        </Panel>
      </div>

      <Panel title="Últimas ventas" description="Cada venta queda registrada al instante.">
        <ul className="divide-y divide-border text-xs">
          <AnimatePresence initial={false}>
            {data.sales.slice(0, 3).map((sale) => (
              <motion.li
                key={sale.number}
                layout
                initial={{ opacity: 0, backgroundColor: "var(--lp-brand-soft)" }}
                animate={{ opacity: 1, backgroundColor: "rgba(255,255,255,0)" }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-between gap-2 py-1.5"
              >
                <span className="font-medium">Venta #{String(sale.number).padStart(6, "0")}</span>
                <span className="text-muted-foreground">{sale.time}</span>
                <span className="font-semibold tabular-nums">{formatARS(sale.total)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Panel>
    </div>
  );
}
