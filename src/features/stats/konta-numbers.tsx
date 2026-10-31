"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { formatCount, parsePublicStats, type PublicStats } from "./public-stats";

/** Matches the endpoint cache, so a visitor who stays sees fresh numbers. */
const REFRESH_MS = 5 * 60 * 1000;

const ease = [0.2, 0.7, 0.2, 1] as const;

function useLiveStats(active: boolean) {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    if (!active || !site.statsUrl) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(site.statsUrl, { signal: controller.signal });
        const next = response.ok ? parsePublicStats(await response.json()) : null;
        // Keep the last good numbers if a refresh fails.
        if (next) setStats(next);
      } catch {
        // Network errors or aborts: the section stays as it was (hidden if never loaded).
      }
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [active]);

  return stats;
}

/** Counts up from zero the first time, then from the previous value on each refresh. */
function Ticker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = formatCount(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 1.6,
      ease,
      onUpdate: (v) => {
        node.textContent = formatCount(v);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatCount(reduce ? value : 0)}
    </span>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

/** "Konta en números": real, anonymous usage counts from every business using Konta. */
export function KontaNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const stats = useLiveStats(inView);

  const items = stats
    ? [
        { label: "ventas registradas", value: stats.sales },
        { label: "productos cargados", value: stats.products },
        { label: "cierres de caja", value: stats.closedCashSessions },
      ]
    : [];

  return (
    <div ref={ref}>
      {stats ? (
        <section aria-labelledby="konta-numbers-title" className="px-4 pb-24 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12 sm:py-20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(19,102,240,.35),transparent)]"
            />

            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <h2
                id="konta-numbers-title"
                className="text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.05] tracking-[-0.04em]"
              >
                Konta en números.
                <br />
                <span className="text-white/45">Y crece todos los días.</span>
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/80">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff5f57] opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#ff5f57]" />
                </span>
                En vivo
              </span>
            </div>

            <dl className="relative mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0">
              {items.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease }}
                  className={i > 0 ? "sm:border-l sm:border-white/10 sm:pl-10" : "sm:pr-10"}
                >
                  <dd className="text-[clamp(48px,6.5vw,84px)] font-bold leading-none tracking-[-0.05em]">
                    <Ticker value={item.value} />
                  </dd>
                  <dt className="mt-3 text-lg text-white/60">{item.label}</dt>
                </motion.div>
              ))}
            </dl>

            <p className="relative mt-12 border-t border-white/10 pt-5 text-sm text-white/45">
              Datos reales y anónimos de todos los negocios que usan Konta · Actualizado a las{" "}
              {formatTime(stats.updatedAt)}
            </p>
          </motion.div>
        </section>
      ) : null}
    </div>
  );
}
