import { site } from "@/lib/site";

export type PlanFeature = {
  text: string;
  /** Part of `text` rendered in bold. */
  bold?: string;
  /** Shown with a dash instead of a check: something the plan leaves out. */
  excluded?: boolean;
};

export type Plan = {
  id: "basico" | "standard" | "premium";
  name: string;
  tagline: string;
  /** Monthly price in ARS. */
  price: number;
  features: PlanFeature[];
  recommended?: boolean;
};

export const plans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    tagline: "Para empezar a ordenar tu negocio. Ideal para comercios atendidos por su dueño.",
    price: 20000,
    features: [
      { text: "2 usuarios", bold: "2" },
      { text: "Hasta 1.000 productos", bold: "1.000" },
      { text: "Todos los módulos de gestión" },
      { text: "Acceso desde PC, tablet o celular" },
      { text: "Soporte por WhatsApp en horario comercial" },
      { text: "Sin facturación electrónica", excluded: true },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Para el comercio que factura. Ideal para negocios con empleados que emiten facturas.",
    price: 40000,
    recommended: true,
    features: [
      { text: "5 usuarios con roles", bold: "5" },
      { text: "Hasta 5.000 productos", bold: "5.000" },
      { text: "Todo lo del Básico" },
      { text: "Facturación electrónica ARCA para monotributistas, con la configuración incluida", bold: "Facturación electrónica ARCA" },
      { text: "Capacitación inicial por videollamada" },
      { text: "Soporte prioritario" },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Para el negocio que crece. Ideal para comercios con mucho surtido o equipos grandes.",
    price: 60000,
    features: [
      { text: "Usuarios y productos ilimitados", bold: "ilimitados" },
      { text: "Todo lo del Standard" },
      { text: "Carga inicial de productos a cargo de Konta" },
      { text: "Capacitación para todo el equipo" },
      // TODO: confirm the response time (the source material has it as "[2]").
      { text: "Soporte con respuesta en menos de 2 horas hábiles" },
    ],
  },
];

export function formatPlanPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export function planWhatsappUrl(plan: Plan): string {
  const message = `Hola! Quiero contratar el plan ${plan.name} de Konta.`;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
