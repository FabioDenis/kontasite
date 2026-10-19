import type { AnySimulation } from "./engine/types";
import { productsSimulation } from "./modules/products";
import { inventorySimulation } from "./modules/inventory";
import { posSimulation } from "./modules/pos";
import { historySimulation } from "./modules/history";
import { expensesSimulation } from "./modules/expenses";
import { customersSimulation } from "./modules/customers";
import { cashSimulation } from "./modules/cash";
import { reportsSimulation } from "./modules/reports";

/**
 * Order in which the modules are presented in the Funciones section. It
 * follows a shop's day: load products, watch stock, sell, look sales up,
 * pay expenses, follow up on credit, close the register, read the numbers.
 */
export const simulations: AnySimulation[] = [
  productsSimulation,
  inventorySimulation,
  posSimulation,
  historySimulation,
  expensesSimulation,
  customersSimulation,
  cashSimulation,
  reportsSimulation,
];
