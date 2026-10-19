"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { simulations } from "@/features/simulations";
import type { AnySimulation } from "@/features/simulations/engine/types";
import { useTimelinePlayer } from "@/features/simulations/engine/use-timeline-player";
import { SimulationStage } from "@/features/simulations/components/simulation-stage";
import { SectionHeading } from "../components/section-heading";

type StepsProps = {
  simulation: AnySimulation;
  /** Current step when this module is the one playing, otherwise null. */
  current: number | null;
  progress: number;
  onStep: (step: number) => void;
};

function StepList({ simulation, current, progress, onStep }: StepsProps) {
  return (
    <ol className="mt-6 space-y-1">
      {simulation.steps.map((step, i) => {
        const isCurrent = current === i;
        const done = current !== null && i < current;
        return (
          <li key={step}>
            <button
              type="button"
              onClick={() => onStep(i)}
              className={cn(
                "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors",
                isCurrent ? "bg-brand-soft" : "hover:bg-ink/[.04]",
              )}
            >
              {isCurrent ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 bg-brand/10"
                  style={{ width: `${progress * 100}%` }}
                />
              ) : null}
              <span
                className={cn(
                  "relative grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs font-medium transition-colors",
                  isCurrent ? "bg-brand text-white" : done ? "bg-brand/15 text-brand" : "bg-ink/[.06] text-ink-soft",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("relative text-[15px] transition-colors", isCurrent ? "font-medium text-ink" : "text-ink-soft")}>
                {step}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ModuleIntro({ simulation, index }: { simulation: AnySimulation; index: number }) {
  return (
    <>
      <span className="font-mono text-sm text-brand">
        {String(index + 1).padStart(2, "0")} · {simulation.module}
      </span>
      <h3 className="mt-3 text-[clamp(30px,3.6vw,46px)] font-bold leading-[1.05] tracking-[-0.04em]">
        {simulation.title}
        <br />
        <span className="text-ink-muted">{simulation.accent}</span>
      </h3>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">{simulation.text}</p>
    </>
  );
}

/** Desktop: text blocks on the left drive one sticky simulation on the right. */
function DesktopFeatures() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });
  const simulation = simulations[active];
  const player = useTimelinePlayer(simulation.frames, simulation.initial, { playing: sectionInView });

  return (
    <div ref={sectionRef} className="mt-6 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-14">
      <div>
        {simulations.map((sim, i) => (
          <DesktopBlock
            key={sim.id}
            simulation={sim}
            index={i}
            active={i === active}
            onActive={() => setActive(i)}
            current={i === active ? player.step : null}
            progress={player.stepProgress}
            onStep={(step) => {
              if (i !== active) setActive(i);
              else player.goToStep(step);
            }}
          />
        ))}
      </div>
      <div>
        <div className="sticky top-0 flex h-screen items-center">
          <SimulationStage key={simulation.id} simulation={simulation} player={player} className="w-full" />
        </div>
      </div>
    </div>
  );
}

function DesktopBlock({
  simulation,
  index,
  active,
  onActive,
  ...steps
}: {
  simulation: AnySimulation;
  index: number;
  active: boolean;
  onActive: () => void;
} & Omit<StepsProps, "simulation">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className={cn("flex min-h-[85vh] flex-col justify-center transition-opacity duration-500", !active && "opacity-35")}>
      <ModuleIntro simulation={simulation} index={index} />
      <StepList simulation={simulation} {...steps} />
    </div>
  );
}

/** Mobile: each module shows its own simulation inline, playing while visible. */
function MobileBlock({ simulation, index }: { simulation: AnySimulation; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const player = useTimelinePlayer(simulation.frames, simulation.initial, { playing: inView });

  return (
    <div className="py-10">
      <ModuleIntro simulation={simulation} index={index} />
      <div ref={ref} className="mt-6">
        <SimulationStage simulation={simulation} player={player} />
      </div>
      <StepList simulation={simulation} current={player.step} progress={player.stepProgress} onStep={player.goToStep} />
    </div>
  );
}

export function Features() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section id="funciones" className="scroll-mt-20 bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Funciones"
          title="Mirá cómo se usa."
          accent="Paso a paso, módulo por módulo."
          description="Cada simulación arranca sola cuando llegás al módulo. Pausala, repetila o tocá un paso para ir directo."
        />
        {isDesktop ? (
          <DesktopFeatures />
        ) : (
          <div className="mt-6 divide-y divide-line">
            {simulations.map((sim, i) => (
              <MobileBlock key={sim.id} simulation={sim} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
