import { describe, expect, it } from "vitest";
import {
  addToCart,
  cartTotal,
  checkout,
  createInitialState,
  expectedCash,
  stockAlerts,
  topSellers,
  type DemoState,
} from "./demo-model";

function withCart(state: DemoState, cart: Record<string, number>): DemoState {
  return { ...state, cart };
}

describe("addToCart", () => {
  it("adds one unit of the product to the cart", () => {
    const state = addToCart(createInitialState(), "coca");

    expect(state.cart).toEqual({ coca: 1 });
  });

  it("never puts more units in the cart than the available stock", () => {
    let state = createInitialState();
    const stock = state.products.find((p) => p.id === "pan")!.stock;

    for (let i = 0; i < stock + 3; i++) state = addToCart(state, "pan");

    expect(state.cart.pan).toBe(stock);
  });

  it("ignores unknown products", () => {
    const initial = createInitialState();

    expect(addToCart(initial, "nope")).toBe(initial);
  });
});

describe("checkout", () => {
  it("does nothing when the cart is empty", () => {
    const initial = createInitialState();

    expect(checkout(initial, { method: "efectivo" })).toBe(initial);
  });

  it("discounts stock, records the sale and clears the cart", () => {
    const initial = withCart(createInitialState(), { coca: 2, yerba: 1 });
    const cocaBefore = initial.products.find((p) => p.id === "coca")!.stock;
    const yerbaBefore = initial.products.find((p) => p.id === "yerba")!.stock;

    const state = checkout(initial, { method: "efectivo" });

    expect(state.products.find((p) => p.id === "coca")!.stock).toBe(cocaBefore - 2);
    expect(state.products.find((p) => p.id === "yerba")!.stock).toBe(yerbaBefore - 1);
    expect(state.cart).toEqual({});
    expect(state.sales[0]).toMatchObject({
      number: initial.sales[0].number + 1,
      total: 2 * 1800 + 4500,
      method: "efectivo",
      units: 3,
    });
    expect(state.lastSaleNumber).toBe(initial.sales[0].number + 1);
  });

  it("adds cash sales to the expected cash in the register", () => {
    const initial = withCart(createInitialState(), { agua: 1 });

    const state = checkout(initial, { method: "efectivo" });

    expect(expectedCash(state)).toBe(expectedCash(initial) + 1200);
  });

  it("keeps non-cash sales out of the expected cash", () => {
    const initial = withCart(createInitialState(), { agua: 1 });

    const state = checkout(initial, { method: "transferencia" });

    expect(expectedCash(state)).toBe(expectedCash(initial));
    expect(state.sales[0].total).toBe(1200);
  });

  it("charges an on-account sale to the customer's balance", () => {
    const initial = withCart(createInitialState(), { alfajor: 2 });
    const customer = initial.customers[0];

    const state = checkout(initial, { method: "cuenta", customerId: customer.id });
    const updated = state.customers.find((c) => c.id === customer.id)!;

    expect(updated.balance).toBe(customer.balance + 1800);
    expect(updated.movements[0]).toMatchObject({ amount: 1800, kind: "compra" });
    expect(expectedCash(state)).toBe(expectedCash(initial));
  });

  it("rejects an on-account sale without a customer", () => {
    const initial = withCart(createInitialState(), { alfajor: 1 });

    expect(checkout(initial, { method: "cuenta" })).toBe(initial);
  });
});

describe("stockAlerts", () => {
  it("flags products at or below their minimum, out of stock first", () => {
    const initial = withCart(createInitialState(), { pan: 2 });

    const alerts = stockAlerts(checkout(initial, { method: "efectivo" }));

    expect(alerts[0]).toMatchObject({ id: "pan", level: "out" });
    expect(alerts.some((a) => a.id === "yerba" && a.level === "low")).toBe(true);
  });
});

describe("cartTotal", () => {
  it("sums price times quantity of every line", () => {
    expect(cartTotal(withCart(createInitialState(), { coca: 2, agua: 1 }))).toBe(4800);
  });
});

describe("topSellers", () => {
  it("ranks products by units sold, leaving out the unsold ones", () => {
    let state = withCart(createInitialState(), { agua: 1, coca: 3 });
    state = checkout(state, { method: "efectivo" });
    state = checkout(withCart(state, { agua: 1 }), { method: "tarjeta" });

    expect(topSellers(state)).toEqual([
      { id: "coca", name: "Coca Cola 500 ml", units: 3, revenue: 5400 },
      { id: "agua", name: "Agua mineral 500 ml", units: 2, revenue: 2400 },
    ]);
  });

  it("is empty before any sale of the session", () => {
    expect(topSellers(createInitialState())).toEqual([]);
  });
});
