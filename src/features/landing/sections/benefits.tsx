import { BadgePercent, ArrowUpRight, Truck } from "lucide-react";
import { Reveal } from "../components/reveal";

// TODO: replace with the real partner distributors once they approve being listed.
const partners = [
  { name: "Distribuidora de bebidas y alimentos", discount: "5% de descuento", detail: "En toda la mercadería, presentando tu membresía Konta." },
  { name: "Mayorista de almacén", discount: "10% de descuento", detail: "Productos seleccionados los lunes, miércoles y viernes, pagando en efectivo." },
];

export function Benefits() {
  return (
    <section id="beneficios" className="scroll-mt-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-[#a9c4ff]">
              <BadgePercent className="size-4" /> Beneficios para socios
            </span>
            <h2 className="mt-6 text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.05] tracking-[-0.04em]">
              Konta se paga solo.
              <br />
              <span className="text-white/45">Con lo que ahorrás comprando.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
              Con tu membresía accedés a descuentos y promociones en distribuidoras y negocios adheridos. Más beneficios, más
              ahorro para tu negocio.
            </p>
          </Reveal>

          <div className="space-y-4">
            {partners.map((p, i) => (
              <Reveal key={p.name} delay={0.15 * i}>
                <article className="group rounded-2xl bg-white p-5 text-ink transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Truck className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">{p.name}</h3>
                        <span className="rounded-full border border-[#f5b301] px-2.5 py-0.5 text-xs font-semibold text-[#b45309]">
                          {p.discount}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-soft">{p.detail}</p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </article>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <p className="text-sm text-white/50">Sumamos distribuidoras de la zona todos los meses.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
