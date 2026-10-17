"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { SectionHeading } from "../components/section-heading";

const pairs = [
  ["El fiado en un cuaderno que nadie entiende", "Cada cliente con su saldo al día"],
  ["La caja no cierra y no sabés por qué", "Sabés cuánto efectivo tiene que haber"],
  ["“¿Me queda yerba?” y vas a fijarte al depósito", "El stock lo ves en pantalla, con avisos"],
  ["A fin de mes, sumar tickets con la calculadora", "El mes resumido en un solo reporte"],
];

const ease = [0.2, 0.7, 0.2, 1] as const;

export function BeforeAfter() {
  return (
    <section className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Menos cuentas a mano." accent="Más tiempo para atender." />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white/60 p-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Antes</p>
            <ul className="mt-5 space-y-4">
              {pairs.map(([before], i) => (
                <motion.li
                  key={before}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease }}
                  className="flex gap-3 text-ink-soft"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#fdece6] text-[#c2410c]">
                    <X className="size-3.5" />
                  </span>
                  <span className="relative">
                    {before}
                    <motion.span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-px w-full origin-left bg-ink-muted/60"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease }}
                    />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-ink p-7 text-white shadow-[0_30px_60px_-30px_rgba(10,16,32,.6)]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#7fa8ff]">Con Konta</p>
            <ul className="mt-5 space-y-4">
              {pairs.map(([, after], i) => (
                <motion.li
                  key={after}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="size-3.5" />
                  </span>
                  {after}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
