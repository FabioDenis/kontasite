import { ArrowRight, Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/features/landing/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import { formatPlanPrice, planWhatsappUrl, plans, type PlanFeature } from "./plans";

function FeatureText({ feature }: { feature: PlanFeature }) {
  if (!feature.bold) return <>{feature.text}</>;
  const [before, after] = feature.text.split(feature.bold);
  return (
    <>
      {before}
      <strong className="font-semibold">{feature.bold}</strong>
      {after}
    </>
  );
}

export function Plans() {
  return (
    <section id="planes" className="scroll-mt-24 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Planes"
          title="Un plan para cada etapa"
          accent="de tu comercio."
          description="Todos incluyen ventas, caja, stock, clientes con cuenta corriente, gastos y reportes, con capacitación y soporte. Cambia el tamaño del negocio."
        />

        <ul className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const dark = plan.id === "premium";
            return (
              <li key={plan.id}>
                <Reveal
                  delay={i * 0.08}
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1",
                    dark ? "bg-ink text-white" : "bg-white",
                    plan.recommended
                      ? "border-2 border-brand shadow-[0_30px_60px_-30px_rgba(19,102,240,.45)]"
                      : dark
                        ? "border border-ink"
                        : "border border-line",
                  )}
                >
                  {plan.recommended ? (
                    <span className="absolute -top-3 right-6 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Recomendado
                    </span>
                  ) : null}

                  <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                  <p className={cn("mt-2 min-h-[4.5em] text-[15px] leading-relaxed", dark ? "text-white/65" : "text-ink-soft")}>
                    {plan.tagline}
                  </p>

                  <p className={cn("mt-5 border-y py-5", dark ? "border-white/10" : "border-line")}>
                    <span className="text-4xl font-bold tracking-[-0.04em] tabular-nums">{formatPlanPrice(plan.price)}</span>
                    <span className={cn("ml-1.5 text-sm", dark ? "text-white/55" : "text-ink-muted")}>/ mes</span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className={cn(
                          "flex gap-3 text-[15px] leading-snug",
                          feature.excluded && (dark ? "text-white/45" : "text-ink-muted"),
                        )}
                      >
                        {feature.excluded ? (
                          <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />
                        ) : (
                          <Check className={cn("mt-0.5 size-4 shrink-0", dark ? "text-[#7aa8ff]" : "text-brand")} aria-hidden />
                        )}
                        <span>
                          <FeatureText feature={feature} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={planWhatsappUrl(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-all hover:-translate-y-0.5",
                      plan.recommended
                        ? "bg-brand text-white hover:bg-brand-strong"
                        : dark
                          ? "bg-white text-ink hover:bg-white/90"
                          : "bg-ink text-white hover:bg-[#1b2336]",
                    )}
                  >
                    Quiero el {plan.name} <ArrowRight className="size-4" />
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-muted">Podés subir o bajar de plan cuando lo necesites.</p>
      </div>
    </section>
  );
}
