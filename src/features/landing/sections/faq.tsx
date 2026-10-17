"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "../components/section-heading";

const faqs = [
  {
    q: "¿Tengo que instalar algo?",
    a: "No. Konta funciona desde el navegador, en la compu del mostrador o en una notebook. Solo necesitás internet.",
  },
  {
    q: "¿Funciona con lector de código de barras?",
    a: "Sí. Conectás el lector, escaneás y el producto entra directo al carrito.",
  },
  {
    q: "¿Pueden usarlo varios empleados?",
    a: "Sí. Cada venta queda registrada con el cajero que la hizo, y cada turno tiene su propia caja.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Cada negocio tiene su información separada y protegida. Solo vos y tu equipo pueden verla.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `${site.price} por mes. Escribinos y te contamos los planes.`,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="scroll-mt-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="Preguntas." accent="Totalmente válidas." />
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-11 w-full items-center justify-between gap-4 py-6 text-left text-lg font-semibold"
                  >
                    {f.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
                      <Plus className="size-5 text-ink-soft" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-lg leading-relaxed text-ink-soft">{f.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
