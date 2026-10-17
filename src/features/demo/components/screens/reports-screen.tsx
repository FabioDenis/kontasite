"use client";

import { motion } from "motion/react";
import { useDemoStore } from "../../store/demo-store";
import {
  averageTicket,
  formatARS,
  salesByMethod,
  todaySales,
  type PaymentMethod,
} from "../../model/demo-model";
import { AnimatedAmount, Panel } from "../demo-ui";

const methodLabels: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  cuenta: "Cuenta corriente",
};

const methodColors: Record<PaymentMethod, string> = {
  efectivo: "var(--chart-1)",
  transferencia: "var(--chart-2)",
  tarjeta: "var(--chart-3)",
  cuenta: "var(--chart-4)",
};

export function ReportsScreen() {
  const data = useDemoStore((s) => s.data);
  const sales = todaySales(data);
  const expenses = data.cashOut;
  const byMethod = salesByMethod(data);
  const max = Math.max(...Object.values(byMethod), 1);

  const summary = [
    { label: "Ventas netas", value: sales, className: "text-foreground" },
    { label: "Gastos", value: expenses, className: "text-[oklch(0.62_0.17_55)]" },
    { label: "Resultado estimado", value: sales - expenses, className: "text-success" },
    { label: "Ticket promedio", value: averageTicket(data), className: "text-foreground" },
  ];

  return (
    <div className="space-y-3">
      <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="border-b border-r border-border p-3 sm:p-4">
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
            <AnimatedAmount
              value={item.value}
              className={`mt-2 block text-right text-lg font-semibold sm:text-xl ${item.className}`}
            />
          </div>
        ))}
      </section>

      <Panel title="Ventas por forma de cobro" description="Cómo te pagaron hoy.">
        <ul className="space-y-3">
          {(Object.keys(byMethod) as PaymentMethod[]).map((method) => (
            <li key={method} className="text-xs">
              <div className="mb-1 flex justify-between">
                <span className="font-medium">{methodLabels[method]}</span>
                <span className="tabular-nums text-muted-foreground">{formatARS(byMethod[method])}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full origin-left rounded-full"
                  style={{ backgroundColor: methodColors[method] }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: byMethod[method] / max }}
                  transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
