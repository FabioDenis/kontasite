/**
 * Live usage counts published by the Konta app at `GET /api/public/stats`.
 * Only global counts: never amounts or anything about a single business.
 */
export type PublicStats = {
  sales: number;
  products: number;
  closedCashSessions: number;
  updatedAt: Date;
};

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/** Validates the endpoint response; anything unexpected returns null and the block stays hidden. */
export function parsePublicStats(body: unknown): PublicStats | null {
  if (!body || typeof body !== "object") return null;
  const { sales, products, closedCashSessions, updatedAt } = body as Record<string, unknown>;
  if (!isCount(sales) || !isCount(products) || !isCount(closedCashSessions)) return null;
  if (typeof updatedAt !== "string") return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return { sales, products, closedCashSessions, updatedAt: date };
}

export function formatCount(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
