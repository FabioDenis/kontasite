"use client";

import { ArrowLeftRight, DollarSign } from "lucide-react";
import { useDemoStore } from "../../store/demo-store";
import { cashSales, expectedCash, formatARS, todaySales } from "../../model/demo-model";
import { AnimatedAmount, Kpi, Panel } from "../demo-ui";

export function CashScreen() {
  const data = useDemoStore((s) => s.data);
  const sold = todaySales(data);
  const inCash = cashSales(data);

  const rows = [
    { label: "Fondo inicial", value: data.cashOpening, className: "text-foreground" },
    { label: "Ventas en efectivo", value: inCash, className: "text-primary", sign: "+" },
    { label: "Egresos / retiros", value: -data.cashOut, className: "text-danger" },
  ];

  return (
    <div className="space-y-3">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Caja activa</h4>
            <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-white">Abierta</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Abierta hoy, 8:40 · Responsable: Marta</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground">
            <ArrowLeftRight className="size-3.5" /> Registrar movimiento
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 px-2.5 py-1.5 text-[11px] font-medium text-danger">
            <DollarSign className="size-3.5" /> Cerrar caja
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Kpi label="Ventas del turno" value={<AnimatedAmount value={sold} />} helper="Todo lo vendido" />
        <Kpi label="Cobrado en efectivo" value={<AnimatedAmount value={inCash} />} helper="Dinero recibido" />
        <Kpi
          label="Efectivo esperado"
          tone="success"
          value={<AnimatedAmount value={expectedCash(data)} />}
          helper="En caja física"
        />
      </div>

      <Panel title="Control de efectivo" description="Konta separa lo que vendiste de lo que cobraste.">
        <ul className="text-sm">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between border-b border-border py-2">
              <span className={row.className}>{row.label}</span>
              <span className={`tabular-nums ${row.className}`}>
                {row.sign}
                <AnimatedAmount value={row.value} />
              </span>
            </li>
          ))}
          <li className="mt-1 flex items-center justify-between rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 font-semibold">
            <span>Efectivo esperado en caja</span>
            <AnimatedAmount value={expectedCash(data)} className="text-lg text-[oklch(0.55_0.16_60)]" />
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Las ventas con transferencia, tarjeta o a cuenta corriente suman a las ventas, pero no al efectivo:{" "}
          {formatARS(sold - inCash)} hoy.
        </p>
      </Panel>
    </div>
  );
}
