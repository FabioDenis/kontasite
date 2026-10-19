"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftRight, Download, DollarSign, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimButton, SimField, SimModal, SimScreen } from "../components/sim-ui";
import type { Simulation } from "../engine/types";
import { money } from "../lib/format";

type State = {
  hover: string;
  modal: "" | "close" | "done";
  counted: string;
  focus: string;
  pdf: boolean;
  /** 0..1 auto-scroll of the PDF preview. */
  pdfScroll: number;
  pressed: string;
};

const OPENING = 15000;
const CASH_SALES = 12000;
const QR_SALES = 5100;
const EXPECTED = OPENING + CASH_SALES;

function Line({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex justify-between py-1", className)}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PdfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="bg-[#ececec] px-2 py-1 text-[9px] font-bold uppercase">{title}</p>
      <div className="px-1 pt-1 text-[8.5px] leading-[1.6]">{children}</div>
    </div>
  );
}

function PdfRow({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: string }) {
  return (
    <div className={cn("flex justify-between", bold && "font-bold")}>
      <span>{label}</span>
      <span className={tone}>{value}</span>
    </div>
  );
}

function CashReportPdf({ scroll }: { scroll: number }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute inset-0 z-40 flex flex-col bg-[#3a3f47]"
    >
      <div className="flex items-center gap-2 bg-[#2a2e35] px-3 py-1.5 text-[10px] text-white/80">
        <FileText className="size-3.5" />
        reporte-caja-19-10-2026.pdf
        <span className="ml-auto flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5">
          <Download className="size-3" /> Descargado
        </span>
        <X className="size-3.5" />
      </div>
      <div className="relative flex-1 overflow-hidden px-10 pt-4">
        <motion.div
          animate={{ y: -scroll * 70 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="mx-auto w-[330px] bg-white px-6 py-5 text-[#111] shadow-xl"
        >
          <p className="text-center text-base font-extrabold tracking-wide">REPORTE DE CAJA</p>
          <p className="text-center text-[8.5px] text-[#666]">lunes, 19 de octubre de 2026</p>
          <div className="mt-2 h-px bg-[#111]" />
          <PdfSection title="Información del turno">
            <PdfRow label="Apertura:" value="4 oct 2026, 10:12 p. m." />
            <PdfRow label="Cajero apertura:" value="fabio" />
            <PdfRow label="Cierre:" value="19 oct 2026, 12:50 a. m." />
            <PdfRow label="Cajero cierre:" value="fabio" />
          </PdfSection>
          <PdfSection title="Ventas del turno">
            <PdfRow label="Cantidad de ventas:" value="6" />
            <PdfRow label="Total vendido:" value={money(CASH_SALES + QR_SALES)} />
          </PdfSection>
          <PdfSection title="Ventas por método de pago">
            <PdfRow label="Efectivo · 5 operaciones" value={money(CASH_SALES)} />
            <PdfRow label="QR MERCADO PAGO · 1 operación" value={money(QR_SALES)} />
            <PdfRow label="Total" value={money(CASH_SALES + QR_SALES)} bold />
          </PdfSection>
          <PdfSection title="Control de efectivo">
            <PdfRow label="Caja inicial:" value={money(OPENING)} />
            <PdfRow label="+ Ventas en efectivo:" value={money(CASH_SALES)} />
            <div className="my-0.5 h-px bg-[#111]" />
            <PdfRow label="Efectivo final esperado en caja:" value={money(EXPECTED)} bold />
            <PdfRow label="Efectivo contado:" value={money(EXPECTED)} />
            <PdfRow label="Sin diferencia:" value={money(0)} bold tone="text-[#1f8a3b]" />
          </PdfSection>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Screen({ state: s }: { state: State }) {
  const counted = Number(s.counted || 0);
  const diff = counted - EXPECTED;

  return (
    <SimScreen className="gap-2.5">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">Caja</h3>
        <p className="text-xs text-muted-foreground">Control de efectivo, movimientos y cierres por turno.</p>
      </div>
      <div className="flex gap-4 border-b border-border text-xs">
        <span className="border-b-2 border-foreground pb-1.5 font-medium">Caja activa</span>
        <span className="pb-1.5 text-muted-foreground">Historial</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            Caja activa <span className="rounded-full bg-success px-2 py-0.5 text-[9px] text-white">Abierta</span>
          </p>
          <p className="text-[10px] text-muted-foreground">Abierta 4 oct 2026, 10:12 p. m. · Responsable: fabio</p>
        </div>
        <div className="flex gap-1.5">
          <SimButton>
            <ArrowLeftRight className="size-3.5" /> Registrar movimiento
          </SimButton>
          <SimButton simId="close" variant="danger" pressed={s.pressed === "close"}>
            <DollarSign className="size-3.5" /> Cerrar caja
          </SimButton>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "sales", label: "Ventas del turno", value: CASH_SALES + QR_SALES, hint: "Todo lo vendido" },
          { id: "income", label: "Ingresos turno", value: CASH_SALES + QR_SALES, hint: "Dinero recibido" },
          { id: "expected", label: "Efectivo esperado", value: EXPECTED, hint: "En caja física" },
        ].map((k) => (
          <div
            key={k.id}
            data-sim={k.id}
            className={cn("rounded-xl border bg-card px-3 py-2.5 transition-colors", s.hover === k.id ? "border-primary bg-primary/5" : "border-border")}
          >
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{k.label}</p>
            <p className="text-base font-semibold tabular-nums">{money(k.value)}</p>
            <p className="text-[9px] text-muted-foreground">{k.hint}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div data-sim="summary" className={cn("rounded-xl border bg-card px-3 py-2", s.hover === "summary" ? "border-primary" : "border-border")}>
          <p className="font-semibold">Resumen del turno</p>
          <Line label="Cobrado en efectivo" value={money(CASH_SALES)} />
          <Line label="Cobrado en QR Mercado Pago" value={money(QR_SALES)} />
          <Line label="Total ventas" value={money(CASH_SALES + QR_SALES)} className="border-t border-border font-semibold" />
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <p className="font-semibold">Control de efectivo</p>
          <Line label="Fondo inicial" value={money(OPENING)} />
          <Line label="Ventas en efectivo" value={money(CASH_SALES)} className="text-primary" />
          <Line label="Egresos / retiros" value={money(0)} className="text-danger" />
          <Line label="Efectivo esperado en caja" value={money(EXPECTED)} className="rounded bg-warning/10 px-1 font-semibold text-[oklch(0.55_0.16_60)]" />
        </div>
      </div>

      <SimModal
        open={s.modal === "close"}
        width={330}
        title="Cerrar caja"
        description="Revisá el control de efectivo e ingresá el importe contado."
        footer={
          <>
            <SimButton variant="outline">Cancelar</SimButton>
            <SimButton simId="confirm" variant="danger" pressed={s.pressed === "confirm"}>
              Confirmar cierre
            </SimButton>
          </>
        }
      >
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-[11px]">
          <Line label="Fondo inicial" value={money(OPENING)} />
          <Line label="+ Ventas en efectivo" value={money(CASH_SALES)} />
          <Line label="+ Otros ingresos y cobros" value={money(0)} />
          <Line label="− Egresos" value={money(0)} />
          <Line label="Efectivo esperado" value={money(EXPECTED)} className="border-t border-border font-semibold" />
        </div>
        <div className="mt-2">
          <SimField label="Efectivo contado" simId="counted" value={s.counted} focused={s.focus === "counted"} />
          <div className="mt-1 flex justify-between text-[11px]">
            <span>{s.counted && diff === 0 ? "Sin diferencia" : "Diferencia"}</span>
            <span className={cn("font-medium tabular-nums", s.counted && diff !== 0 && "text-danger")}>
              {money(s.counted ? diff : 0)}
            </span>
          </div>
        </div>
      </SimModal>

      <SimModal
        open={s.modal === "done"}
        width={330}
        title="Caja cerrada correctamente"
        description="El cierre quedó registrado. El reporte también seguirá disponible en Historial."
        footer={
          <>
            <SimButton variant="outline">Cerrar</SimButton>
            <SimButton simId="pdf" pressed={s.pressed === "pdf"}>
              <Download className="size-3.5" /> Descargar PDF
            </SimButton>
          </>
        }
      >
        <span />
      </SimModal>

      <AnimatePresence>{s.pdf ? <CashReportPdf scroll={s.pdfScroll} /> : null}</AnimatePresence>
    </SimScreen>
  );
}

export const cashSimulation: Simulation<State> = {
  id: "cash",
  module: "Caja",
  title: "Cerrá la caja.",
  accent: "Sin que falte un peso.",
  text: "Konta separa lo que vendiste de lo que cobraste y te dice cuánto efectivo tiene que haber. Contás, cerrás y te llevás el reporte en PDF.",
  steps: [
    "Revisá el resumen del turno",
    "Tocá “Cerrar caja”",
    "Ingresá el efectivo que contaste",
    "Confirmá el cierre",
    "Descargá el reporte de caja en PDF",
  ],
  initial: { hover: "", modal: "", counted: "", focus: "", pdf: false, pdfScroll: 0, pressed: "" },
  frames: [
    { step: 0, duration: 1100, target: "sales", set: { hover: "sales" } },
    { step: 0, duration: 1100, target: "summary", set: { hover: "summary" } },
    { step: 0, duration: 1300, target: "expected", set: { hover: "expected" } },
    { step: 1, duration: 800, target: "close", set: { hover: "" } },
    { step: 1, duration: 450, target: "close", click: true, set: { pressed: "close" } },
    { step: 2, duration: 500, target: "counted", set: { modal: "close", pressed: "", focus: "counted" } },
    { step: 2, duration: 1100, type: { key: "counted", text: "27000" } },
    { step: 3, duration: 800, target: "confirm", set: { focus: "" } },
    { step: 3, duration: 450, target: "confirm", click: true, set: { pressed: "confirm" } },
    { step: 3, duration: 1300, target: "pdf", set: { modal: "done", pressed: "" } },
    { step: 4, duration: 450, target: "pdf", click: true, set: { pressed: "pdf" } },
    { step: 4, duration: 1800, set: { modal: "", pdf: true, pressed: "" } },
    { step: 4, duration: 2600, set: { pdfScroll: 1 } },
  ],
  Screen,
};
