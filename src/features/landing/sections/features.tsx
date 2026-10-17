"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../components/section-heading";
import { CashVisual, CreditVisual, NumbersVisual, SellVisual, StockVisual } from "./feature-visuals";

const features = [
  {
    title: "Vendé rápido.",
    accent: "Sin filas en el mostrador.",
    text: "Buscás por nombre o pasás el lector de código de barras. Descuento o recargo en un toque, y cobrás con F4.",
    Visual: SellVisual,
  },
  {
    title: "Cerrá la caja.",
    accent: "Sin que falte un peso.",
    text: "Konta separa lo que vendiste de lo que cobraste y te dice cuánto efectivo tiene que haber. Al cerrar el turno, contás y ves la diferencia.",
    Visual: CashVisual,
  },
  {
    title: "Controlá el stock.",
    accent: "Sin decir “no me queda”.",
    text: "Cada venta descuenta stock sola. Definís un mínimo y Konta te avisa qué reponer. Cada ajuste queda registrado.",
    Visual: StockVisual,
  },
  {
    title: "Anotá el fiado.",
    accent: "Sin cuaderno.",
    text: "Vendé a cuenta corriente a tus clientes de confianza. Cada compra y cada pago queda anotado. Sabés quién debe y cuánto.",
    Visual: CreditVisual,
  },
  {
    title: "Mirá tus números.",
    accent: "Sin planillas.",
    text: "Ventas del día, la semana y el mes. Ticket promedio, lo que más se vende, tus gastos y lo que te deben.",
    Visual: NumbersVisual,
  },
];

function FeatureText({
  index,
  active,
  onActive,
}: {
  index: number;
  active: boolean;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const feature = features[index];

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-10 lg:min-h-[78vh] lg:py-0 lg:last:min-h-[60vh]">
      <span className="font-mono text-sm text-brand">0{index + 1}</span>
      <h3
        className={cn(
          "mt-3 text-[clamp(32px,4vw,50px)] font-bold leading-[1.05] tracking-[-0.04em] transition-opacity duration-500",
          active ? "opacity-100" : "lg:opacity-25",
        )}
      >
        {feature.title}
        <br />
        <span className="text-ink-muted">{feature.accent}</span>
      </h3>
      <p className={cn("mt-5 max-w-md text-lg leading-relaxed text-ink-soft transition-opacity duration-500", !active && "lg:opacity-40")}>
        {feature.text}
      </p>
      <div className="mt-8 flex justify-center lg:hidden">
        <feature.Visual />
      </div>
    </div>
  );
}

export function Features() {
  const [active, setActive] = useState(0);
  const ActiveVisual = features[active].Visual;

  return (
    <section id="funciones" className="scroll-mt-20 bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Funciones"
          title="Todo lo que pasa en el mostrador."
          accent="Ordenado solo."
          description="Cada venta que registrás alimenta la caja, el stock y los reportes. Vos atendés; Konta lleva la cuenta."
        />

        <div className="mt-10 grid gap-10 lg:mt-0 lg:grid-cols-2 lg:gap-16">
          <div>
            {features.map((f, i) => (
              <FeatureText key={f.title} index={i} active={active === i} onActive={setActive} />
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative grid w-full place-items-center rounded-[2rem] bg-paper p-10 ring-1 ring-line">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(19,102,240,.10),transparent)]"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                    className="relative flex w-full justify-center"
                  >
                    <ActiveVisual />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-5 flex gap-1.5" aria-hidden>
                  {features.map((f, i) => (
                    <span
                      key={f.title}
                      className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-6 bg-brand" : "w-1.5 bg-line")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
