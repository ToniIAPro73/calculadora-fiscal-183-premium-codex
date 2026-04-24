# calculadora-fiscal-183-premium-codex

Premium fiscal residency calculator rebuilt with TaxNomad-style architecture and visuals, with business logic ported selectively from `calculadora-fiscal-183`.

## Stack

- React + TypeScript + Vite
- TaxNomad-inspired visual system and component structure
- Fiscal day-range domain logic extracted into `src/lib`
- Vitest for domain tests
- Stripe Checkout through Vercel serverless API routes
- Server-side paid PDF generation with `jspdf`
- Neon/Postgres storage for pending paid report payloads

## Available scripts

- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`

For local payment testing, run the app through Vercel's dev server so `/api/*` routes are available, and set `APP_URL` to that local origin.

## Current scope

- Premium calculator UI styled after `taxnomad-183-day-calculator`
- Real range add/edit/remove flow
- Overlap detection and merged unique-day summary
- 183-day threshold status calculation
- Stripe-gated premium PDF report
- Privacy policy and terms pages

## Notes

- Sample PDF preview is loaded on demand to keep the initial app bundle lighter.
- Paid PDF generation happens server-side after Stripe confirms payment.
- Theme and language preferences persist in `localStorage`.
- Execute `docs/stripe-neon-schema.sql` in Neon before enabling Checkout.
