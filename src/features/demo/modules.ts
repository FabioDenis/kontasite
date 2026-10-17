import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  Package,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ModuleId = "dashboard" | "pos" | "cash" | "inventory" | "customers" | "reports";

export type DemoModule = {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

/** Same labels and icons as the real Konta sidebar. */
export const demoModules: DemoModule[] = [
  {
    id: "dashboard",
    label: "Vista General",
    icon: LayoutDashboard,
    title: "Vista General",
    subtitle: "Control rápido de ventas, stock y actividad del negocio.",
  },
  {
    id: "pos",
    label: "Punto de Venta",
    icon: DollarSign,
    title: "Punto de Venta",
    subtitle: "Tocá productos, elegí cómo te pagan y cobrá.",
  },
  {
    id: "cash",
    label: "Caja",
    icon: Wallet,
    title: "Caja",
    subtitle: "Control de efectivo, movimientos y cierres por turno.",
  },
  {
    id: "inventory",
    label: "Inventario",
    icon: Package,
    title: "Inventario",
    subtitle: "Monitoreo de productos con control de stock y alertas.",
  },
  {
    id: "customers",
    label: "Clientes",
    icon: Users,
    title: "Clientes",
    subtitle: "Gestión de clientes y cuentas corrientes.",
  },
  {
    id: "reports",
    label: "Reportes",
    icon: BarChart3,
    title: "Reportes",
    subtitle: "Información clara para entender y decidir.",
  },
];
