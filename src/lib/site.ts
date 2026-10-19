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
  price: "[PRECIO]", // TODO: real monthly price
  location: "Posadas, Misiones",
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
