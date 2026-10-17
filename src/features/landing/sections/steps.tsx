import { Monitor, PackagePlus, Store } from "lucide-react";
import { Reveal } from "../components/reveal";
import { SectionHeading } from "../components/section-heading";

const steps = [
  {
    n: "01",
    icon: Monitor,
    title: "Te creamos la cuenta",
    text: "Entrás desde cualquier compu con navegador. No hay nada que instalar.",
  },
  {
    n: "02",
    icon: PackagePlus,
    title: "Cargás tus productos",
    text: "Nombre, precio y código de barras. Si querés, también el stock mínimo.",
  },
  {
    n: "03",
    icon: Store,
    title: "Abrís la caja y vendés",
    text: "Desde la primera venta, Konta lleva la cuenta por vos.",
  },
];

export function Steps() {
  return (
    <section className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Empezás a vender hoy." accent="No en un mes." />
        <ol className="relative mt-16 grid gap-5 md:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.12}>
              <li className="relative h-full rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(10,16,32,.3)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-ink-muted">{step.n}</span>
                </div>
                <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
