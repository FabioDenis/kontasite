"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { LiveDashboard } from "@/features/demo/components/live-dashboard";
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

/** Logo mark + name, large: the first thing the visitor sees. */
function BrandLockup() {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-center justify-center gap-[0.22em] text-[clamp(64px,11vw,132px)] leading-none">
      <motion.span
        initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
        className="relative block h-[0.8em] w-[0.83em] shrink-0"
      >
        <Image src="/konta-logo-light.png" alt="" fill sizes="(min-width: 1024px) 110px, 70px" priority className="object-contain" />
      </motion.span>
      <span className="flex font-extrabold tracking-[-0.055em] text-brand">
        {"Konta".split("").map((letter, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0, y: "0.35em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // The 3D tilt distorts the panel on narrow screens, so it only runs from tablet up.
  const tilt = useMediaQuery("(min-width: 768px)") && !reduce;
  const { scrollYProgress } = useScroll({ target: panelRef, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-20 sm:pt-36">
      {/* Soft brand glow behind the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(19,102,240,.18),transparent)]"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <h1>
          <BrandLockup />
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mx-auto mt-6 block max-w-[880px] text-[clamp(30px,4.4vw,58px)] font-bold leading-[1.05] tracking-[-0.04em] text-balance"
          >
            Todo lo que pasa en tu negocio,{" "}
            <span className="bg-gradient-to-r from-brand to-[#5b8cff] bg-clip-text text-transparent">en un solo lugar.</span>
          </motion.span>
        </h1>

        <FadeUp delay={0.7}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl text-pretty">
            El sistema de gestión para negocios y comercios. Vendés, cobrás y Konta ordena la caja, el stock, los clientes
            y tus números.
          </p>
        </FadeUp>

        <FadeUp delay={0.82} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(19,102,240,.7),inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:-translate-y-0.5 hover:bg-brand-strong"
          >
            Quiero probarlo <ArrowRight className="size-4" />
          </a>
          <a
            href="#funciones"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink ring-1 ring-line transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
          >
            Mirá cómo se usa <ArrowDown className="size-4" />
          </a>
        </FadeUp>

        <FadeUp delay={0.95} className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-ink-muted">Funciona desde el navegador · Sin instalar nada</p>
          <a
            href="#beneficios"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-xs text-ink-soft shadow-sm transition-colors hover:border-brand/40 sm:text-sm"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
              <Sparkles className="size-3" /> Nuevo
            </span>
            Descuentos en distribuidoras para socios
            <ArrowRight className="size-3.5" />
          </a>
        </FadeUp>
      </div>

      <div id="demo" ref={panelRef} className="relative mx-auto mt-16 max-w-6xl scroll-mt-24 [perspective:1600px] sm:mt-20">
        <motion.p
          initial={reduce ? false : { opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute -top-12 left-2 hidden font-hand text-3xl text-brand md:block lg:-left-6"
        >
          Así se ve tu día ;-)
          <svg width="70" height="48" viewBox="0 0 70 48" fill="none" className="ml-16 mt-1" aria-hidden>
            <path d="M4 4c18 4 36 14 52 36m0 0-2-14m2 14-13-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.p>
        <motion.div
          style={tilt ? { scale, rotateX, transformOrigin: "50% 0%" } : undefined}
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease }}
        >
          <LiveDashboard />
        </motion.div>
        <p className="mt-5 text-center text-sm text-ink-muted">
          Cada venta actualiza sola la caja, el stock, las alertas y tus números. Así trabaja Konta mientras vos atendés.
        </p>
      </div>
    </section>
  );
}
