"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { DemoWindow } from "@/features/demo/components/demo-window";
import { whatsappUrl } from "@/lib/site";
import { useMediaQuery } from "@/lib/use-media-query";

const ease = [0.2, 0.7, 0.2, 1] as const;

function FadeUp({ delay, children, className }: { delay: number; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const demoRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // The 3D tilt distorts the demo on narrow screens, so it only runs from tablet up.
  const tilt = useMediaQuery("(min-width: 768px)") && !reduce;
  const { scrollYProgress } = useScroll({ target: demoRef, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-20 sm:pt-40">
      {/* Soft brand glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(19,102,240,.16),transparent)]"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <FadeUp delay={0}>
          <a
            href="#beneficios"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-sm text-ink-soft shadow-sm transition-colors hover:border-brand/40"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
              <Sparkles className="size-3" /> Nuevo
            </span>
            Descuentos en distribuidoras para socios
            <ArrowRight className="size-3.5" />
          </a>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="mx-auto mt-7 max-w-[920px] text-[clamp(42px,6.4vw,84px)] font-bold leading-none tracking-[-0.05em] text-balance">
            De la venta al cierre de caja.
            <br />
            <span className="bg-gradient-to-r from-brand to-[#5b8cff] bg-clip-text text-transparent">Todo en un lugar.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl text-pretty">
            Konta es el sistema para kioscos, almacenes y comercios de barrio. Vendés, cobrás y Konta ordena la caja, el
            stock y tus números.
          </p>
        </FadeUp>

        <FadeUp delay={0.32} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(19,102,240,.7),inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:-translate-y-0.5 hover:bg-brand-strong"
          >
            Quiero probarlo <ArrowRight className="size-4" />
          </a>
          <a
            href="#demo"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink ring-1 ring-line transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
          >
            Ver la demo <ArrowDown className="size-4" />
          </a>
        </FadeUp>
        <FadeUp delay={0.45}>
          <p className="mt-4 text-sm text-ink-muted">Funciona desde el navegador · Sin instalar nada</p>
        </FadeUp>
      </div>

      <div id="demo" ref={demoRef} className="relative mx-auto mt-16 max-w-6xl scroll-mt-24 [perspective:1600px] sm:mt-20">
        <motion.p
          initial={reduce ? false : { opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: -4 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute -top-12 left-2 hidden font-hand text-3xl text-brand md:block lg:-left-6"
        >
          Dale, probalo ;-)
          <svg width="70" height="48" viewBox="0 0 70 48" fill="none" className="ml-16 mt-1" aria-hidden>
            <path d="M4 4c18 4 36 14 52 36m0 0-2-14m2 14-13-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.p>
        <motion.div
          style={tilt ? { scale, rotateX, transformOrigin: "50% 0%" } : undefined}
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease }}
        >
          <DemoWindow />
        </motion.div>
        <p className="mt-5 text-center text-sm text-ink-muted">
          Esta es una demo real: tocá productos, cobrá y mirá cómo se actualizan la caja, el stock y los reportes.
        </p>
      </div>
    </section>
  );
}
