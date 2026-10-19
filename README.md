# Konta — landing

Marketing landing for Konta, the management system for businesses and shops. It opens with a live Konta panel where sales arrive on their own, and walks through each module with guided, auto-playing simulations.

## Stack

Next.js 16 (App Router, statically prerendered), React 19, Tailwind CSS 4, Motion and Vitest.

## Scripts

```bash
npm run dev     # local development
npm test        # demo rules and simulation timeline (Vitest)
npm run lint
npm run build   # production build
```

## Structure

- `src/features/demo`: "Konta en vivo" hero panel, a Vista General that replays a day of sales.
  - `model/demo-model.ts`: pure business rules, with tests next to it.
- `src/features/simulations`: guided step-by-step simulations shown in Funciones.
  - `engine/timeline.ts`: pure timeline, with tests next to it.
  - `modules/`: one simulation per Konta module.
- `src/features/landing`: page sections and shared motion helpers.
- `src/lib/site.ts`: business data. The domain, app URL, WhatsApp number and price are **placeholders** marked `TODO`.
- `design-reference/`: the original design mockup, kept as visual reference only.

The demo reuses the Konta app's design tokens (`globals.css`, "Deep Blue Tech") so it looks like the real product.
