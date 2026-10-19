import Image from "next/image";
import { site, whatsappUrl } from "@/lib/site";

const groups = [
  {
    title: "Producto",
    links: [
      { label: "Funciones", href: "#funciones" },
      { label: "Beneficios", href: "#beneficios" },
      { label: "Preguntas", href: "#preguntas" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "WhatsApp", href: whatsappUrl },
      { label: "Ingresar", href: site.appUrl },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-14">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 md:flex-row">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <Image src="/konta-logo-light.png" alt="" width={180} height={174} className="h-6 w-auto" />
            <span className="text-lg font-bold tracking-tight">Konta</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            El sistema de gestión para negocios y comercios. Hecho en {site.location}.
          </p>
        </div>
        <div className="flex gap-16">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-semibold">{g.title}</p>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-ink-soft hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-line pt-6 text-sm text-ink-muted">
        <span>© 2026 Konta</span>
        <span>Un producto de {site.author}</span>
      </div>
    </footer>
  );
}
