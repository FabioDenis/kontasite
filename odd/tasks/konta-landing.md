# Konta landing

Objective: animated marketing landing for Konta with an interactive "mini Konta" demo. Branch: `main` (fresh repo, no remote); simulations on `feat/guided-simulations`.
Delivery: ask-on-risk. Test runner: Vitest (store logic) + `next build` / `eslint` for the rest.

## Specs

- S1 — Present Konta in a landing that attracts customers: "mi idea es presentar a Konta en la landing, q atraiga clientes explicar el sistema de forma simple y atractica, una landign animada y con info que sea clara".
- S2 — Reference style: "mi referencia es https://www.billow.so/ quiero lograr algo asi". Billow pattern: hero + playable product demo, 3 steps, feature sections, FAQ, closing CTA.
- S3 — Show the system modules interactively: "mi idea es mostrar las funcionalidades de forma interactiva y clara". Modules (from screenshots): Vista General, Productos, Inventario, Punto de Venta, Historial de Ventas, Caja, Clientes, Gastos, Reportes, Beneficios.
- S4 — Stack agreed in conversation: Next.js 16 + Tailwind 4 + Motion, reusing Konta's real tokens and presentational shadcn/ui components from `C:\Users\USER\Desktop\Sistema-Negocio\sistema`; mock data only (no Prisma, Neon or auth).
- S5 — Copy and visual direction come from `design-reference/Main.dc.html` (mockup: Geist, `#F7F7F5` background, `#1366F0` accent).
- Assumption A1: price and WhatsApp number/app login URL are unknown; they live as placeholders in `src/lib/site.ts`.
- S6 — Guided step-by-step simulation per module: "se podria poner una simulacion como si fuera el paso a paso para utilizar cada modulo por ejemplo tocas punto de venta, y muestra de forma simple como realizar una venta, en gastos lo mismo, en caja te deja navegar y muestra como cerrar caja y muestra que se puede descargar un pdf y mustra como se ve, en productos muetra como se crea un producto [...] como si fuera una simulacion que arranca cuando tocas el modulo".
- S7 — Placement: the Funciones section ("mejor debajo en la seccion de funciones que va mostrando modulo a modulo, con una pequeña descripcion"). Decision: hero keeps the free playable demo; Funciones shows one auto-playing simulation per module with numbered steps, starting when the module enters view.
- S8 — Flows follow the user's screenshots (2026-10-19): Productos (panel → "Nuevo producto" modal → "Producto creado correctamente."), Inventario (search with stock data), Punto de Venta (search → "Cobrar" modal with payment method → "¡Venta registrada!"), Historial de Ventas (search and filter), Caja ("Cerrar caja" → "Caja cerrada correctamente" → "Descargar PDF" → "REPORTE DE CAJA"), Clientes (debt follow-up; detail panel from app code: "Saldo pendiente", "Días de mora", "Movimientos de cuenta", "Aplicar recargo"), Gastos ("Nuevo gasto" modal → "Registrar gasto"), Reportes (ventas). Vista General: "es solo navegacion vista" (stays in the hero demo).
- S9 — Hero brand: "me gustaria que el nombre y el logo predomine en la imagen del principio con el eslogan". Slogan: "Todo lo que pasa en tu negocio, en un solo lugar."
- S10 — Hero product section no longer duplicates Funciones: the navigable demo becomes a non-interactive "Konta en vivo" Vista General where sales arrive on their own (user asked: "que me recomendas para la seccion de Producto donde se puede navegar entre modulos [...] ya que debajo se muestra el funcionamiento").

## Tasks

| ID | Specs | Route | Status | Evidence |
|----|-------|-------|--------|----------|
| T1 | S4, S5 | inline | done | d8892d1 |
| T2 | S2, S3, S4 | inline | done | a6cc73f; Vitest RED (missing module) → GREEN 12/12 |
| T3 | S1, S2, S3, S5 | inline | done | 7f3969f |
| T4 | S1 | inline | done | lint clean, build static, Playwright 1440px + 390px: no page errors, 0px horizontal overflow |
| T5 | S6 | inline | done | 7dff879; Vitest RED (missing module) → GREEN 21/21 |
| T6 | S6, S8 | inline | done | 4febcad |
| T7 | S7 | inline | done | 23c9b06 |
| T9 | S9 | inline | done | b6dda49 |
| T10 | S10 | inline | done | d2de791; Vitest RED (topSellers missing) → GREEN; Playwright 1440px + 390px: no page errors, 0px overflow |
| T8 | S6, S7 | inline | done | lint clean, build static, Playwright 1440px (8 modules) + 390px: no page errors, 0px overflow |

- T1: scaffold, tokens, fonts, logo, copied UI kit.
- T2: mini Konta demo with shared store (sell → stock, caja, dashboard update); Vitest for store rules.
- T3: landing sections (nav, hero, steps, module features with scroll animation, before/after, rubros, todo incluido, beneficios, FAQ, CTA, footer).
- T4: responsive, reduced motion, metadata, lint + build.
- T5: timeline engine (pure `resolveTimeline` + Vitest) and player hook, scaled stage, animated cursor, captions.
- T6: eight module simulations matching the screenshots.
- T7: Funciones section rewired: steps list synced with the sticky stage (desktop) and inline stages (mobile), autoplay in view.
- T8: visual QA desktop + mobile, lint, build.

## Log

- L1 (2026-10-17): "bien, mira mi referencia es https://www.billow.so/ quiero lograr algo asi, mi idea es presentar a Konta en la landing, q atraiga clientes explicar el sistema de forma simple y atractica, una landign animada y con info que sea clara [...] estos son los modulos del sistema, mi idea es mostrar las funcionalidades de forma interactiva y clara, podes investigar y ver que tecnologias, librerias lenguajes etc se podria utilizar"
- L2: Konta stack confirmed by user (Next.js 16, Tailwind 4, shadcn/ui, Base UI, Framer Motion, Prisma/Neon). Repo confirmed: `Sistema-Negocio\sistema`.
- L3: `C:\Users\USER` is itself a git repo; created a dedicated repo in `Landing-Konta` so commits never land in the home repo. Mockup moved to `design-reference/`.
- L4: Copied Konta UI components ended unused (demo replicates tokens/classes in lighter pieces); removed them and their deps (@base-ui/react, cva, shadcn, tw-animate-css).
- L5: Visual QA fixes: chart axis clipping, empty bar chart (percent heights without sized parent), mobile 3D tilt distortion (tilt now md+ only), POS grid min-content overflow.
- L6: Pending from user: real domain, app URL, WhatsApp number, price, and whether partner distributors can be named (placeholders in `src/lib/site.ts` and `benefits.tsx`).
- L7 (2026-10-19): user asked for step-by-step simulations per module; placement decided in Funciones (hero keeps free demo). Order follows a shop's day: Productos, Inventario, Punto de Venta, Historial, Gastos, Clientes, Caja, Reportes.
- L8: QA fixes: backdrop-filter inside the scaled stage mirrored edges in Chromium (removed blur); each loop remounts the screen to avoid exit animations overlapping; POS search box stretched in a flex column.
- L9: The "cliente con mora" screenshot was a duplicate of the list; detail panel labels taken from app code (customer-detail-panel.tsx, apply-surcharge-dialog.tsx).
- L10 (2026-10-19): user: "este eslogan Todo lo que pasa en tu negocio, en un solo lugar." — taken as approval of the hero brand lockup + live panel proposal.
- L11: Removed the navigable demo (DemoWindow, screens, Zustand store) and unused model helpers (removeFromCart, salesByMethod); logo mark cropped from the isotype PNG because the SVGs in the app repo are an older logo version.
