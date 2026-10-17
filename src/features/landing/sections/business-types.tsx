"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Candy, ShoppingBasket, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../components/section-heading";

const types = [
  {
    id: "kiosco",
    label: "Kioscos",
    icon: Candy,
    title: "Ventas rápidas, muchas por hora",
    text: "Cobrás en dos toques con el lector de código de barras y la caja de cada turno queda clara para el que entra después.",
  },
  {
    id: "almacen",
    label: "Almacenes",
    icon: ShoppingBasket,
    title: "Fiado y stock de lo que más sale",
    text: "Llevás la cuenta corriente de cada vecino y Konta te avisa cuando la yerba o el aceite están por terminarse.",
  },
  {
    id: "libreria",
    label: "Librerías",
    icon: BookOpen,
    title: "Cientos de artículos chicos",
    text: "Encontrás cualquier artículo por nombre o código y sabés qué reponer antes del inicio de clases.",
  },
  {
    id: "poli",
    label: "Polirrubros",
    icon: Store,
    title: "Un poco de todo",
    text: "Organizás por categorías y ves qué rubro te deja más en los reportes.",
  },
];

export function BusinessTypes() {
  const [selected, setSelected] = useState(types[0].id);
  const current = types.find((t) => t.id === selected)!;

  return (
    <section className="bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <SectionHeading align="left" title="Tu comercio," accent="en una pantalla." description="Konta se adapta a cómo trabajás. Elegí tu rubro:" />

        <div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rubros">
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === selected}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "relative inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
                  t.id === selected ? "border-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {t.id === selected ? (
                  <motion.span layoutId="business-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                ) : null}
                <t.icon className="relative size-4" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="relative mt-6 min-h-[180px] overflow-hidden rounded-3xl border border-line bg-paper p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                role="tabpanel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <current.icon className="size-8 text-brand" />
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">{current.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-ink-soft">{current.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
