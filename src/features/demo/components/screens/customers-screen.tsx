"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "../../store/demo-store";
import { formatARS } from "../../model/demo-model";
import { AnimatedAmount, Kpi, Panel } from "../demo-ui";

export function CustomersScreen() {
  const customers = useDemoStore((s) => s.data.customers);
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const selected = customers.find((c) => c.id === selectedId) ?? customers[0];
  const totalDebt = customers.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Clientes" icon={Users} value={customers.length} />
        <Kpi label="Con deuda" icon={CircleAlert} tone="warning" value={customers.filter((c) => c.balance > 0).length} />
        <Kpi label="Saldo pendiente" icon={DollarSign} value={<AnimatedAmount value={totalDebt} />} />
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel title="Listado de clientes" description="Tocá un cliente para ver su cuenta.">
          <ul className="space-y-1.5">
            {customers.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors",
                    c.id === selected.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {c.name[0]}
                  </span>
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className={cn("font-semibold tabular-nums", c.balance > 0 ? "text-foreground" : "text-muted-foreground")}>
                    <AnimatedAmount value={c.balance} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={selected.name}
          description="Cuenta corriente"
          action={
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Saldo</p>
              <AnimatedAmount value={selected.balance} className="text-base font-semibold" />
            </div>
          }
        >
          <ul className="text-xs">
            <AnimatePresence initial={false}>
              {selected.movements.length === 0 ? (
                <li className="py-4 text-center text-muted-foreground">Sin movimientos todavía.</li>
              ) : (
                selected.movements.map((m) => (
                  <motion.li
                    key={m.label}
                    layout
                    initial={{ opacity: 0, x: -10, backgroundColor: "var(--lp-brand-soft)" }}
                    animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
                    className="flex items-center justify-between border-b border-border px-1 py-2 last:border-0"
                  >
                    <span>{m.label}</span>
                    <span className={cn("font-semibold tabular-nums", m.kind === "pago" ? "text-success" : "text-foreground")}>
                      {m.amount > 0 ? "+ " : ""}
                      {formatARS(m.amount)}
                    </span>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
