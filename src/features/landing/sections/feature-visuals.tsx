"use client";

import { motion } from "motion/react";
import { ArrowLeftRight, Banknote, CreditCard, NotebookPen, Search, ShoppingCart } from "lucide-react";
import { CountUp } from "@/features/demo/components/demo-ui";
import { formatARS } from "@/features/demo/model/demo-model";
import { cn } from "@/lib/utils";

const ease = [0.2, 0.7, 0.2, 1] as const;

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("konta-app w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-36px_rgba(10,16,32,.35)]", className)}>
      {children}
    </div>
  );
}

function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.ul>
  );
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

export function SellVisual() {
  const methods = [
    { label: "Efectivo", icon: Banknote },
    { label: "Transferencia", icon: ArrowLeftRight },
    { label: "Tarjeta", icon: CreditCard },
    { label: "Cuenta corriente", icon: NotebookPen },
  ];
  const keys = [
    { key: "F2", label: "Buscar", icon: Search },
    { key: "F4", label: "Cobrar", icon: ShoppingCart },
    { key: "%", label: "Descuento o recargo", icon: null },
  ];
  return (
    <Card>
      <p className="text-sm font-semibold">¿Cómo te pagan?</p>
      <Stagger className="mt-4 grid grid-cols-2 gap-2">
        {methods.map((m, i) => (
          <motion.li
            key={m.label}
            variants={item}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium",
              i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            <m.icon className="size-4" /> {m.label}
          </motion.li>
        ))}
      </Stagger>
      <Stagger className="mt-5 space-y-2 border-t border-border pt-5">
        {keys.map((k) => (
          <motion.li key={k.key} variants={item} className="flex items-center gap-3 text-sm text-muted-foreground">
            <kbd className="grid h-7 min-w-9 place-items-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground shadow-[0_2px_0_var(--border)]">
              {k.key}
            </kbd>
            {k.label}
          </motion.li>
        ))}
      </Stagger>
    </Card>
  );
}

export function CashVisual() {
  const summary = [
    { label: "Vendido", value: 26300 },
    { label: "Cobrado", value: 22100 },
    { label: "A cuenta", value: 4200 },
  ];
  const rows = [
    { label: "Fondo inicial", value: "$ 10.000", tone: "" },
    { label: "Ventas en efectivo", value: "+ $ 18.450", tone: "text-primary" },
    { label: "Retiros y gastos", value: "− $ 4.000", tone: "text-danger" },
  ];
  return (
    <Card>
      <div className="grid grid-cols-3 gap-2">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/70 p-3">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <CountUp value={s.value} className="mt-1 block text-base font-semibold" />
          </div>
        ))}
      </div>
      <Stagger className="mt-5 text-sm">
        {rows.map((r) => (
          <motion.li key={r.label} variants={item} className="flex justify-between border-b border-border py-2.5">
            <span className={r.tone}>{r.label}</span>
            <span className={cn("tabular-nums", r.tone)}>{r.value}</span>
          </motion.li>
        ))}
      </Stagger>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
        className="mt-3 flex items-center justify-between rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 font-semibold"
      >
        <span>Efectivo esperado</span>
        <CountUp value={24450} className="text-lg text-[oklch(0.55_0.16_60)]" />
      </motion.div>
    </Card>
  );
}

export function StockVisual() {
  const rows = [
    { name: "Coca Cola 1,5 L", stock: 10, max: 12, label: "10 u.", tone: "bg-success", text: "text-muted-foreground" },
    { name: "Yerba 1 kg", stock: 3, max: 12, label: "3 u. · Bajo", tone: "bg-warning", text: "text-[oklch(0.5_0.13_70)] font-semibold" },
    { name: "Pan lactal", stock: 0, max: 12, label: "Sin stock", tone: "bg-danger", text: "text-danger font-semibold" },
  ];
  return (
    <Card>
      <p className="text-sm font-semibold">Inventario</p>
      <ul className="mt-4 space-y-4">
        {rows.map((r, i) => (
          <li key={r.name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium">{r.name}</span>
              <span className={cn("text-xs", r.text)}>{r.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn("h-full origin-left rounded-full", r.tone)}
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: Math.max(r.stock / r.max, 0.02) }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease }}
              />
            </div>
          </li>
        ))}
      </ul>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
        className="mt-5 rounded-xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger"
      >
        2 productos para reponer
      </motion.p>
    </Card>
  );
}

export function CreditVisual() {
  const movements = [
    { label: "Compra · Venta #000112", amount: "+ $ 3.400", tone: "" },
    { label: "Pago en efectivo", amount: "− $ 2.000", tone: "text-success" },
    { label: "Compra · Venta #000120", amount: "+ $ 4.800", tone: "" },
  ];
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-primary/10 font-semibold text-primary">M</span>
        <div className="flex-1">
          <p className="font-semibold">Marta Gómez</p>
          <p className="text-xs text-muted-foreground">Cuenta corriente</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Saldo</p>
          <CountUp value={6200} className="text-lg font-semibold" />
        </div>
      </div>
      <Stagger className="mt-5 text-sm">
        {movements.map((m) => (
          <motion.li key={m.label} variants={item} className="flex justify-between border-t border-border py-2.5">
            <span>{m.label}</span>
            <span className={cn("font-medium tabular-nums", m.tone)}>{m.amount}</span>
          </motion.li>
        ))}
      </Stagger>
    </Card>
  );
}

export function NumbersVisual() {
  const days = [
    { d: "lun", v: 0.45 },
    { d: "mar", v: 0.62 },
    { d: "mié", v: 0.52 },
    { d: "jue", v: 0.74 },
    { d: "vie", v: 0.95 },
    { d: "sáb", v: 0.82 },
    { d: "dom", v: 0.3 },
  ];
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Ventas del mes</p>
          <CountUp value={1284500} className="mt-1 block text-2xl font-semibold" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ticket promedio</p>
          <CountUp value={8047} format={formatARS} className="mt-1 block text-2xl font-semibold" />
        </div>
      </div>
      <div className="mt-6 flex h-40 items-end gap-2.5">
        {days.map((day, i) => (
          <div key={day.d} className="flex h-full flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
            <motion.div
              className={cn("w-full origin-bottom rounded-t-lg", day.d === "vie" ? "bg-primary" : "bg-primary/25")}
              style={{ height: `${day.v * 100}%` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, delay: i * 0.07, ease }}
            />
            </div>
            <span className="text-[11px] text-muted-foreground">{day.d}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
