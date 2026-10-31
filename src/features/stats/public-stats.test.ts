import { describe, expect, it } from "vitest";
import { formatCount, parsePublicStats } from "./public-stats";

const valid = { sales: 12480, products: 3215, closedCashSessions: 842, updatedAt: "2026-10-31T12:00:00.000Z" };

describe("parsePublicStats", () => {
  it("accepts the endpoint response", () => {
    expect(parsePublicStats(valid)).toEqual({ ...valid, updatedAt: new Date(valid.updatedAt) });
  });

  it.each([
    ["null", null],
    ["an error body", { error: "No se pudieron cargar las estadísticas." }],
    ["a missing count", { ...valid, products: undefined }],
    ["a count sent as text", { ...valid, sales: "12480" }],
    ["a negative count", { ...valid, closedCashSessions: -1 }],
    ["a fractional count", { ...valid, sales: 1.5 }],
    ["an invalid date", { ...valid, updatedAt: "yesterday" }],
  ])("rejects %s so the block stays hidden", (_label, body) => {
    expect(parsePublicStats(body)).toBeNull();
  });
});

describe("formatCount", () => {
  it("groups thousands the Argentine way", () => {
    expect(formatCount(12480)).toBe("12.480");
    expect(formatCount(842)).toBe("842");
    expect(formatCount(1250000)).toBe("1.250.000");
  });
});
