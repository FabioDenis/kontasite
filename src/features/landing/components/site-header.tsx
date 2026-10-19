"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { site, whatsappUrl } from "@/lib/site";

const links = [
  { href: "#demo", label: "Producto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#preguntas", label: "Preguntas" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-300",
          scrolled ? "border border-line bg-white/80 shadow-[0_10px_30px_-20px_rgba(10,16,32,.35)] backdrop-blur-xl" : "border border-transparent",
        )}
      >
        <a href="#top" className="flex items-center gap-2" aria-label="Konta, inicio">
          <Image src="/konta-logo-light.png" alt="" width={180} height={174} className="h-7 w-auto" priority />
          <span className="text-lg font-bold tracking-tight">Konta</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-medium text-ink-soft transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.appUrl} className="hidden px-3 text-[15px] font-medium text-ink-soft hover:text-ink sm:inline">
            Ingresar
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1b2336]"
          >
            Empezar
          </a>
        </div>
      </div>
    </motion.header>
  );
}
