# Konta landing

Objective: animated marketing landing for Konta with an interactive "mini Konta" demo. Branch: `main` (fresh repo, no remote).
Delivery: ask-on-risk. Test runner: Vitest (store logic) + `next build` / `eslint` for the rest.

## Specs

- S1 — Present Konta in a landing that attracts customers: "mi idea es presentar a Konta en la landing, q atraiga clientes explicar el sistema de forma simple y atractica, una landign animada y con info que sea clara".
- S2 — Reference style: "mi referencia es https://www.billow.so/ quiero lograr algo asi". Billow pattern: hero + playable product demo, 3 steps, feature sections, FAQ, closing CTA.
- S3 — Show the system modules interactively: "mi idea es mostrar las funcionalidades de forma interactiva y clara". Modules (from screenshots): Vista General, Productos, Inventario, Punto de Venta, Historial de Ventas, Caja, Clientes, Gastos, Reportes, Beneficios.
- S4 — Stack agreed in conversation: Next.js 16 + Tailwind 4 + Motion, reusing Konta's real tokens and presentational shadcn/ui components from `C:\Users\USER\Desktop\Sistema-Negocio\sistema`; mock data only (no Prisma, Neon or auth).
- S5 — Copy and visual direction come from `design-reference/Main.dc.html` (mockup: Geist, `#F7F7F5` background, `#1366F0` accent).
- Assumption A1: price and WhatsApp number/app login URL are unknown; they live as placeholders in `src/lib/site.ts`.

## Tasks

| ID | Specs | Route | Status | Evidence |
|----|-------|-------|--------|----------|
| T1 | S4, S5 | inline | done | d8892d1 |
| T2 | S2, S3, S4 | inline | done | a6cc73f; Vitest RED (missing module) → GREEN 12/12 |
| T3 | S1, S2, S3, S5 | inline | done | 7f3969f |
| T4 | S1 | inline | done | lint clean, build static, Playwright 1440px + 390px: no page errors, 0px horizontal overflow |

- T1: scaffold, tokens, fonts, logo, copied UI kit.
- T2: mini Konta demo with shared store (sell → stock, caja, dashboard update); Vitest for store rules.
- T3: landing sections (nav, hero, steps, module features with scroll animation, before/after, rubros, todo incluido, beneficios, FAQ, CTA, footer).
- T4: responsive, reduced motion, metadata, lint + build.

## Log

- L1 (2026-10-17): "bien, mira mi referencia es https://www.billow.so/ quiero lograr algo asi, mi idea es presentar a Konta en la landing, q atraiga clientes explicar el sistema de forma simple y atractica, una landign animada y con info que sea clara [...] estos son los modulos del sistema, mi idea es mostrar las funcionalidades de forma interactiva y clara, podes investigar y ver que tecnologias, librerias lenguajes etc se podria utilizar"
- L2: Konta stack confirmed by user (Next.js 16, Tailwind 4, shadcn/ui, Base UI, Framer Motion, Prisma/Neon). Repo confirmed: `Sistema-Negocio\sistema`.
- L3: `C:\Users\USER` is itself a git repo; created a dedicated repo in `Landing-Konta` so commits never land in the home repo. Mockup moved to `design-reference/`.
- L4: Copied Konta UI components ended unused (demo replicates tokens/classes in lighter pieces); removed them and their deps (@base-ui/react, cva, shadcn, tw-animate-css).
- L5: Visual QA fixes: chart axis clipping, empty bar chart (percent heights without sized parent), mobile 3D tilt distortion (tilt now md+ only), POS grid min-content overflow.
- L6: Pending from user: real domain, app URL, WhatsApp number, price, and whether partner distributors can be named (placeholders in `src/lib/site.ts` and `benefits.tsx`).
