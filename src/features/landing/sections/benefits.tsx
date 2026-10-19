"use client";

import { motion } from "motion/react";
import { ArrowUpRight, BadgePercent, ChevronDown, Info, ShoppingBasket, Tag, Truck } from "lucide-react";
import { Reveal } from "../components/reveal";

/**
 * Example partners shown in the replica of the Konta "Beneficios" screen.
 * They are intentionally generic: the real partners are actual businesses.
 */
const partners = [
  {
    name: "Distribuidora de Bebidas",
    discount: "5% descuento",
    detail: "Bebidas y alimentos para tu comercio, con entrega en el día.",
    logo: { icon: Truck, color: "#1366f0", label: "DISTRIBUIDORA" },
  },
  {
    name: "Mayorista de Alimentos",
    discount: "10% descuento",
    detail: "Productos seleccionados los lunes, miércoles y viernes, pagando en efectivo.",
    logo: { icon: ShoppingBasket, color: "#16a34a", label: "MAYORISTA" },
  },
];

const ease = [0.2, 0.7, 0.2, 1] as const;

function GenericLogo({ icon: Icon, color, label }: (typeof partners)[number]["logo"]) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="grid size-12 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: color }}>
        <Icon className="size-6" />
      </span>
      <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function BenefitsScreen() {
  return (
    <div className="konta-app overflow-hidden rounded-2xl border border-white/10 bg-background text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-4">
        <div className="max-w-md">
          <h3 className="text-xl font-semibold tracking-tight">Beneficios</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Beneficios disponibles para usar en negocios adheridos. Tocá un beneficio para ver cómo aprovecharlo.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-xs sm:flex" aria-hidden>
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground">Buscar por título, descripción…</span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5">
            Todas las categorías <ChevronDown className="size-3.5" />
          </span>
          <span className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground">Buscar</span>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {partners.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease }}
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="grid h-24 place-items-center border-b-[3px] border-[#f5b301] bg-white">
              <GenericLogo {...p.logo} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold">{p.name}</h4>
                <span className="shrink-0 rounded-full border border-[#f5b301] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#c2710c]">
                  {p.discount}
                </span>
              </div>
              <p className="mt-2 min-h-10 text-xs leading-relaxed text-secondary-foreground">{p.detail}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Tag className="size-3.5" /> General
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Ver beneficio <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mx-5 mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Info className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Más beneficios, más ahorro para tu negocio</p>
          <p className="text-xs text-muted-foreground">
            Descubrí cómo aprovechar los descuentos y promociones de los negocios adheridos con tu membresía Konta.
          </p>
        </div>
        <span className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium">Conocé cómo funciona</span>
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <section id="beneficios" className="scroll-mt-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-5 py-14 text-white sm:px-12 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-[#a9c4ff]">
              <BadgePercent className="size-4" /> Beneficios exclusivos para socios
            </span>
            <h2 className="mt-6 text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.05] tracking-[-0.04em]">
              Gestioná mejor.
              <br />
              <span className="text-white/45">Comprá con beneficios.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
              Por ser parte de KONTA, accedés a descuentos y promociones en distribuidores y comercios adheridos. Una ventaja
              más para hacer crecer tu negocio.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <BenefitsScreen />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
