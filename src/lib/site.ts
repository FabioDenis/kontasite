/**
 * Business data shown on the landing. Values marked TODO are placeholders
 * until the real ones are confirmed.
 */
export const site = {
  name: "Konta",
  url: "https://konta.example.com", // TODO: real domain
  appUrl: "https://app.konta.example.com", // TODO: real app login URL
  description:
    "Konta es el sistema de gestión para negocios y comercios. Vendés, cobrás y Konta ordena la caja, el stock, los clientes y tus números.",
  whatsappNumber: "5493760000000", // TODO: real WhatsApp number (international format, digits only)
  whatsappMessage: "Hola! Quiero conocer Konta para mi comercio.",
  price: "[PRECIO]", // TODO: real monthly price
  location: "Posadas, Misiones",
  author: "Denis Fabio",
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
