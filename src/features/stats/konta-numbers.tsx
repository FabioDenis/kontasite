"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Package, ShoppingCart, Wallet } from "lucide-react";
import { AnimatedAmount } from "@/features/demo/components/demo-ui";
import { site } from "@/lib/site";
import { formatCount, parsePublicStats, type PublicStats } from "./public-stats";

/** Matches the endpoint cache, so a visitor who stays sees fresh numbers. */
const REFRESH_MS = 5 * 60 * 1000;

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
        // Network errors or aborts: the block stays as it was (hidden if never loaded).
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
        { label: "Ventas registradas", value: stats.sales, icon: ShoppingCart },
        { label: "Productos cargados", value: stats.products, icon: Package },
        { label: "Cierres de caja", value: stats.closedCashSessions, icon: Wallet },
      ]
    : [];

  return (
    <div ref={ref} className="mx-auto mt-10 max-w-4xl">
      {stats ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          aria-labelledby="konta-numbers-title"
          className="konta-app overflow-hidden rounded-2xl border border-black/10 bg-background text-left shadow-[0_24px_50px_-30px_rgba(10,16,32,.35)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 pt-4 pb-3">
            <div>
              <h2 id="konta-numbers-title" className="text-lg font-semibold tracking-tight">
                Konta en números
              </h2>
              <p className="text-xs text-muted-foreground">Lo que registran todos los negocios que usan Konta.</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-danger">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-danger" />
              </span>
              En vivo
            </span>
          </div>
          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-4" />
                </span>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
                  <dd className="text-2xl font-semibold text-foreground">
                    <AnimatedAmount value={item.value} format={formatCount} />
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <p className="border-t border-border bg-card px-5 py-2.5 text-[11px] text-muted-foreground">
            Datos reales y anónimos de todos los comercios que usan Konta · Actualizado a las {formatTime(stats.updatedAt)}
          </p>
        </motion.section>
      ) : null}
    </div>
  );
}
