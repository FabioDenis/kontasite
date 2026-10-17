"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "../../store/demo-store";
import {
  cartLines,
  cartTotal,
  cartUnits,
  formatARS,
  type PaymentMethod,
} from "../../model/demo-model";
import { AnimatedAmount } from "../demo-ui";

const methods: { id: PaymentMethod; label: string }[] = [
  { id: "efectivo", label: "Efectivo" },
  { id: "transferencia", label: "Transferencia" },
  { id: "tarjeta", label: "Tarjeta" },
  { id: "cuenta", label: "Cuenta corriente" },
];

export function PosScreen() {
  const data = useDemoStore((s) => s.data);
  const add = useDemoStore((s) => s.add);
  const remove = useDemoStore((s) => s.remove);
  const charge = useDemoStore((s) => s.charge);
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [customerId, setCustomerId] = useState(data.customers[0].id);

  const lines = cartLines(data);
  const total = cartTotal(data);
  const units = cartUnits(data);
  const untouched = units === 0 && data.lastSaleNumber === null && data.sales[0].number === 90;

  return (
    <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <Search className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate">Buscar producto por nombre o código…</span>
          <kbd className="rounded border border-border bg-muted px-1.5 text-[10px] font-medium">F2</kbd>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {data.products.map((product, i) => {
            const left = product.stock - (data.cart[product.id] ?? 0);
            const out = left <= 0;
            const low = !out && left <= product.min;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => add(product.id)}
                disabled={out}
                className={cn(
                  "group rounded-xl border border-border bg-card p-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_10px_20px_-14px_rgba(19,102,240,.6)] active:scale-[.97] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:shadow-none",
                  untouched && i === 0 && "animate-ring",
                )}
              >
                <span className="line-clamp-1 text-xs font-medium text-foreground">{product.name}</span>
                <span className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="text-sm font-semibold tabular-nums text-foreground">{formatARS(product.price)}</span>
                  <span
                    className={cn(
                      "text-[10px] tabular-nums",
                      out ? "font-semibold text-danger" : low ? "font-semibold text-warning" : "text-muted-foreground",
                    )}
                  >
                    {out ? "Sin stock" : `${left} u.`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex min-h-[132px] flex-1 flex-col rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-sm font-medium">
            <ShoppingCart className="size-4 text-primary" />
            Carrito
            <span className="ml-auto grid size-5 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
              {units}
            </span>
          </div>
          <ul className="max-h-40 flex-1 overflow-y-auto">
            <AnimatePresence initial={false}>
              {lines.length === 0 ? (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-6 text-center text-xs text-muted-foreground"
                >
                  {untouched ? "Tocá un producto para agregarlo" : "El carrito está vacío"}
                </motion.li>
              ) : (
                lines.map(({ product, quantity, subtotal }) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -12, backgroundColor: "var(--lp-brand-soft)" }}
                    animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 border-b border-border px-3 py-2 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium uppercase">{product.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {quantity} × {formatARS(product.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatARS(subtotal)}</span>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger"
                      aria-label={`Quitar ${product.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Medio de pago</p>
        <div className="grid grid-cols-2 gap-1.5">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              aria-pressed={method === m.id}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                method === m.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-secondary-foreground hover:border-primary/50",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {method === "cuenta" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="mb-1.5 text-[11px] text-muted-foreground">¿A qué cliente se lo anotás?</p>
              <div className="flex flex-wrap gap-1.5">
                {data.customers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCustomerId(c.id)}
                    aria-pressed={customerId === c.id}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      customerId === c.id ? "border-foreground bg-foreground text-background" : "border-border",
                    )}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</span>
            <AnimatedAmount value={total} className="text-2xl font-semibold text-primary" />
          </div>
          <button
            type="button"
            disabled={total === 0}
            onClick={() => charge({ method, customerId })}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--accent-primary-strong)] active:scale-[.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <ShoppingCart className="size-4" />
            Cobrar {formatARS(total)}
            <kbd className="rounded bg-white/20 px-1.5 text-[10px]">F4</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
