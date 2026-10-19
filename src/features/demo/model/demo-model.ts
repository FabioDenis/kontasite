/**
 * Pure state model for the "mini Konta" demo. Every rule the visitor can
 * trigger (sell, charge on account, stock alerts, cash count) lives here so
 * it can be tested without React.
 */

export type PaymentMethod = "efectivo" | "transferencia" | "tarjeta" | "cuenta";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  min: number;
};

export type Sale = {
  number: number;
  time: string;
  total: number;
  units: number;
  method: PaymentMethod;
  customer: string;
};

export type CustomerMovement = {
  label: string;
  amount: number;
  kind: "compra" | "pago";
};

export type Customer = {
  id: string;
  name: string;
  balance: number;
  movements: CustomerMovement[];
};

export type DemoState = {
  products: Product[];
  cart: Record<string, number>;
  sales: Sale[];
  customers: Customer[];
  cashOpening: number;
  cashOut: number;
  /** Net sales of the six days before today, oldest first. */
  previousDays: number[];
  lastSaleNumber: number | null;
};

export type CheckoutInput = {
  method: PaymentMethod;
  customerId?: string;
};

export type StockAlert = {
  id: string;
  name: string;
  stock: number;
  level: "low" | "out";
};

export function createInitialState(): DemoState {
  return {
    products: [
      { id: "coca", name: "Coca Cola 500 ml", category: "Bebidas", price: 1800, stock: 12, min: 4 },
      { id: "agua", name: "Agua mineral 500 ml", category: "Bebidas", price: 1200, stock: 8, min: 3 },
      { id: "alfajor", name: "Alfajor triple", category: "Kiosco", price: 900, stock: 5, min: 3 },
      { id: "galletitas", name: "Galletitas surtidas", category: "Almacén", price: 1250, stock: 6, min: 2 },
      { id: "yerba", name: "Yerba 1 kg", category: "Almacén", price: 4500, stock: 3, min: 3 },
      { id: "pan", name: "Pan lactal", category: "Almacén", price: 2300, stock: 2, min: 2 },
      { id: "detergente", name: "Detergente 750 ml", category: "Limpieza", price: 1600, stock: 9, min: 3 },
      { id: "fideos", name: "Fideos tirabuzón 500 g", category: "Almacén", price: 1100, stock: 14, min: 4 },
    ],
    cart: {},
    sales: [
      { number: 90, time: "11:42", total: 6300, units: 3, method: "efectivo", customer: "Mostrador" },
      { number: 89, time: "11:15", total: 4500, units: 1, method: "transferencia", customer: "Mostrador" },
      { number: 88, time: "10:58", total: 3400, units: 2, method: "cuenta", customer: "Marta Gómez" },
      { number: 87, time: "10:21", total: 8200, units: 4, method: "efectivo", customer: "Mostrador" },
      { number: 86, time: "09:47", total: 2700, units: 3, method: "tarjeta", customer: "Mostrador" },
      { number: 85, time: "09:12", total: 5600, units: 2, method: "efectivo", customer: "Mostrador" },
    ],
    customers: [
      {
        id: "marta",
        name: "Marta Gómez",
        balance: 6200,
        movements: [
          { label: "Compra · Venta #000088", amount: 3400, kind: "compra" },
          { label: "Pago en efectivo", amount: -2000, kind: "pago" },
          { label: "Compra · Venta #000071", amount: 4800, kind: "compra" },
        ],
      },
      {
        id: "jorge",
        name: "Jorge Benítez",
        balance: 2500,
        movements: [{ label: "Compra · Venta #000064", amount: 2500, kind: "compra" }],
      },
      { id: "lucia", name: "Lucía Fernández", balance: 0, movements: [] },
    ],
    cashOpening: 10000,
    cashOut: 4000,
    previousDays: [38400, 52100, 44800, 61300, 57900, 70200],
    lastSaleNumber: null,
  };
}

function findProduct(state: DemoState, id: string) {
  return state.products.find((p) => p.id === id);
}

export function addToCart(state: DemoState, productId: string): DemoState {
  const product = findProduct(state, productId);
  if (!product) return state;

  const inCart = state.cart[productId] ?? 0;
  if (inCart >= product.stock) return state;

  return {
    ...state,
    cart: { ...state.cart, [productId]: inCart + 1 },
    lastSaleNumber: null,
  };
}

export function cartLines(state: DemoState) {
  return state.products
    .filter((p) => (state.cart[p.id] ?? 0) > 0)
    .map((p) => {
      const quantity = state.cart[p.id];
      return { product: p, quantity, subtotal: quantity * p.price };
    });
}

export function cartTotal(state: DemoState): number {
  return cartLines(state).reduce((sum, line) => sum + line.subtotal, 0);
}

export function cartUnits(state: DemoState): number {
  return cartLines(state).reduce((sum, line) => sum + line.quantity, 0);
}

function currentTime(state: DemoState): string {
  // Each new sale lands a few minutes after the latest one, keeping the
  // demo deterministic regardless of the visitor's clock.
  const [hours, minutes] = state.sales[0].time.split(":").map(Number);
  const next = hours * 60 + minutes + 4;
  return `${String(Math.floor(next / 60) % 24).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
}

export function checkout(state: DemoState, input: CheckoutInput): DemoState {
  const lines = cartLines(state);
  if (lines.length === 0) return state;

  const customer =
    input.method === "cuenta"
      ? state.customers.find((c) => c.id === input.customerId)
      : undefined;
  if (input.method === "cuenta" && !customer) return state;

  const total = cartTotal(state);
  const number = state.sales[0].number + 1;
  const sale: Sale = {
    number,
    time: currentTime(state),
    total,
    units: cartUnits(state),
    method: input.method,
    customer: customer?.name ?? "Mostrador",
  };

  return {
    ...state,
    products: state.products.map((p) => ({ ...p, stock: p.stock - (state.cart[p.id] ?? 0) })),
    cart: {},
    sales: [sale, ...state.sales],
    customers: state.customers.map((c) =>
      c.id === customer?.id
        ? {
            ...c,
            balance: c.balance + total,
            movements: [
              { label: `Compra · Venta ${formatSaleNumber(number)}`, amount: total, kind: "compra" },
              ...c.movements,
            ],
          }
        : c,
    ),
    lastSaleNumber: number,
  };
}

export function stockAlerts(state: DemoState): StockAlert[] {
  return state.products
    .filter((p) => p.stock <= p.min)
    .map((p): StockAlert => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      level: p.stock <= 0 ? "out" : "low",
    }))
    .sort((a, b) => a.stock - b.stock);
}

export type TopSeller = { id: string; name: string; units: number; revenue: number };

/** Products sold during the session (stock consumed since the initial state), best first. */
export function topSellers(state: DemoState): TopSeller[] {
  const initial = new Map(createInitialState().products.map((p) => [p.id, p.stock]));
  return state.products
    .map((p) => {
      const units = (initial.get(p.id) ?? p.stock) - p.stock;
      return { id: p.id, name: p.name, units, revenue: units * p.price };
    })
    .filter((p) => p.units > 0)
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue);
}

export function todaySales(state: DemoState): number {
  return state.sales.reduce((sum, s) => sum + s.total, 0);
}

export function cashSales(state: DemoState): number {
  return state.sales.filter((s) => s.method === "efectivo").reduce((sum, s) => sum + s.total, 0);
}

export function expectedCash(state: DemoState): number {
  return state.cashOpening + cashSales(state) - state.cashOut;
}

export function weekSeries(state: DemoState): number[] {
  return [...state.previousDays, todaySales(state)];
}

export function averageTicket(state: DemoState): number {
  return state.sales.length === 0 ? 0 : Math.round(todaySales(state) / state.sales.length);
}

export function formatSaleNumber(number: number): string {
  return `#${String(number).padStart(6, "0")}`;
}

export function formatARS(value: number): string {
  const sign = value < 0 ? "−" : "";
  const digits = Math.round(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}$ ${digits}`;
}
