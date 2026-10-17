import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { Reveal } from "../components/reveal";

export function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:pb-32">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,.25),transparent),radial-gradient(40%_60%_at_100%_100%,rgba(10,16,32,.35),transparent)]"
        />
        <h2 className="relative mx-auto max-w-[820px] text-[clamp(36px,5.4vw,72px)] font-bold leading-[1.02] tracking-[-0.05em]">
          Tu negocio, en orden.
          <br />
          <span className="text-white/60">Desde hoy.</span>
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-lg text-white/80">
          Escribinos y te mostramos Konta funcionando con productos de tu comercio.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
        >
          <MessageCircle className="size-5" /> Hablemos por WhatsApp
        </a>
      </Reveal>
    </section>
  );
}
