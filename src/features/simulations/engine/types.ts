import type { ComponentType } from "react";
import type { Frame } from "./timeline";

export type SimulationId =
  | "products"
  | "inventory"
  | "pos"
  | "history"
  | "expenses"
  | "customers"
  | "cash"
  | "reports";

export type Simulation<S> = {
  id: SimulationId;
  /** Module label as shown in the Konta sidebar. */
  module: string;
  title: string;
  accent: string;
  text: string;
  /** Visible step captions, in order. Frames point to them by index. */
  steps: string[];
  initial: S;
  frames: Frame<S>[];
  Screen: ComponentType<{ state: S }>;
};

/** Erased form used by lists that mix simulations with different state shapes. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySimulation = Simulation<any>;
