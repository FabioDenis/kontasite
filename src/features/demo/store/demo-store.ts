"use client";

import { create } from "zustand";
import {
  addToCart,
  checkout,
  createInitialState,
  removeFromCart,
  type CheckoutInput,
  type DemoState,
} from "../model/demo-model";
import type { ModuleId } from "../modules";

type DemoStore = {
  data: DemoState;
  active: ModuleId;
  /** Modules whose numbers changed since the visitor last opened them. */
  changed: ModuleId[];
  open: (module: ModuleId) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  charge: (input: CheckoutInput) => void;
  reset: () => void;
};

export const useDemoStore = create<DemoStore>((set) => ({
  data: createInitialState(),
  active: "pos",
  changed: [],
  open: (module) =>
    set((s) => ({ active: module, changed: s.changed.filter((m) => m !== module) })),
  add: (productId) => set((s) => ({ data: addToCart(s.data, productId) })),
  remove: (productId) => set((s) => ({ data: removeFromCart(s.data, productId) })),
  charge: (input) =>
    set((s) => {
      const data = checkout(s.data, input);
      if (data === s.data) return s;

      const touched: ModuleId[] = ["dashboard", "cash", "inventory", "reports"];
      if (input.method === "cuenta") touched.push("customers");
      return { data, changed: Array.from(new Set([...s.changed, ...touched])) };
    }),
  reset: () => set({ data: createInitialState(), active: "pos", changed: [] }),
}));
