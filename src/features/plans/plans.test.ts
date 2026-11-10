import { describe, expect, it } from "vitest";
import { formatPlanPrice, planWhatsappUrl, plans } from "./plans";

describe("plans", () => {
  it("lists the three plans in order", () => {
    expect(plans.map((p) => p.name)).toEqual(["Básico", "Standard", "Premium"]);
  });

  it("formats the monthly price in pesos", () => {
    expect(formatPlanPrice(20000)).toBe("$20.000");
  });

  it("builds a WhatsApp link that names the chosen plan", () => {
    const url = new URL(planWhatsappUrl(plans[1]));
    expect(url.origin + url.pathname).toBe("https://wa.me/5493764333078");
    expect(url.searchParams.get("text")).toBe("Hola! Quiero contratar el plan Standard de Konta.");
  });
});
