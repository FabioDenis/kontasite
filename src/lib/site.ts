/**
 * Business data shown on the landing. Values marked TODO are placeholders
 * until the real ones are confirmed.
 */
export const site = {
  name: "Konta",
  url: "https://konta.example.com", // TODO: real domain
  description:
    "Konta es el sistema de gestión para negocios y comercios. Vendés, cobrás y Konta ordena la caja, el stock, los clientes y tus números.",
  /** 376 4333078, in international format: 54 (Argentina) + 9 (mobile) + area code + number. */
  whatsappNumber: "5493764333078",
  whatsappMessage: "Hola! Quiero conocer Konta para mi comercio.",
  location: "Posadas, Misiones",
  /**
   * Public usage stats endpoint of the Konta app (GET /api/public/stats).
   * NEXT_PUBLIC_KONTA_STATS_URL overrides it at build time. If the endpoint fails,
   * "Konta en números" stays hidden.
   */
  statsUrl: process.env.NEXT_PUBLIC_KONTA_STATS_URL ?? "https://sistema-saas-negocio.vercel.app/api/public/stats",
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
