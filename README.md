# Konta — landing

Marketing landing for Konta, the management system for neighborhood shops. It includes a playable "mini Konta" demo: visitors add products, charge a sale, and watch the cash register, stock, customers and reports update.

## Stack

Next.js 16 (App Router, statically prerendered), React 19, Tailwind CSS 4, Motion, Zustand, and Vitest.

## Scripts

```bash
npm run dev     # local development
npm test        # demo business rules (Vitest)
npm run lint
npm run build   # production build
```

## Structure

- `src/features/demo`: interactive demo.
  - `model/demo-model.ts`: pure rules, with tests next to it.
  - `store/demo-store.ts`: Zustand store.
  - `components/`: the app shell and the six screens.
- `src/features/landing`: page sections and shared motion helpers.
- `src/lib/site.ts`: business data. The domain, app URL, WhatsApp number and price are **placeholders** marked `TODO`.
- `design-reference/`: the original design mockup, kept as visual reference only.

The demo reuses the Konta app's design tokens (`globals.css`, "Deep Blue Tech") so it looks like the real product.
