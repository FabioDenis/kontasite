import {
  BadgePercent,
  BarChart3,
  DollarSign,
  FileSpreadsheet,
  NotebookPen,
  Package,
  QrCode,
  Receipt,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Reveal } from "../components/reveal";
import { SectionHeading } from "../components/section-heading";

const features = [
  { name: "Punto de venta", desc: "Búsqueda, lector y atajos de teclado", icon: DollarSign },
  { name: "Caja por turnos", desc: "Apertura, movimientos y cierre", icon: Wallet },
  { name: "Inventario", desc: "Stock mínimo y alertas", icon: Package },
  { name: "Cuentas corrientes", desc: "Fiado con saldo al día", icon: NotebookPen },
  { name: "Historial de ventas", desc: "Filtrá por fecha y medio de pago", icon: ReceiptText },
  { name: "Gastos", desc: "Lo que sale, registrado", icon: Receipt },
  { name: "Reportes", desc: "Ventas, resultados y deudas", icon: BarChart3 },
  { name: "Beneficios", desc: "Descuentos en distribuidoras", icon: BadgePercent },
  { name: "Mercado Pago", desc: "Cobros con QR y Point", icon: QrCode, soon: true },
  { name: "Importar desde Excel", desc: "Tu catálogo en un paso", icon: FileSpreadsheet, soon: true },
];

export function AllIncluded() {
  return (
    <section className="bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Todo incluido."
          accent="Y sigue creciendo."
          description={`Un solo plan con todos los módulos: ${site.price} por mes.`}
        />
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <Reveal key={f.name} delay={(i % 5) * 0.06}>
              <li
                className={cn(
                  "h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(10,16,32,.3)]",
                  f.soon ? "border-dashed border-line bg-paper" : "border-line bg-white",
                )}
              >
                <div className="flex items-center justify-between">
                  <f.icon className={cn("size-5", f.soon ? "text-ink-muted" : "text-brand")} />
                  {f.soon ? (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">Pronto</span>
                  ) : null}
                </div>
                <h3 className="mt-4 font-semibold">{f.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{f.desc}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
