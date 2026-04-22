# calculadora-fiscal-183-premium-codex

Premium fiscal residency calculator rebuilt with TaxNomad-style architecture and visuals, with business logic ported selectively from `calculadora-fiscal-183`.

## Stack

- React + TypeScript + Vite
- TaxNomad-inspired visual system and component structure
- Fiscal day-range domain logic extracted into `src/lib`
- Vitest for domain tests
- Simple client-side PDF generation with lazy-loaded `jspdf`

## Available scripts

- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`

## Current scope

- Premium calculator UI styled after `taxnomad-183-day-calculator`
- Real range add/edit/remove flow
- Overlap detection and merged unique-day summary
- 183-day threshold status calculation
- Simple downloadable PDF report
- Privacy policy and terms pages

## Notes

- PDF generation is loaded on demand to keep the initial app bundle lighter.
- Theme and language preferences persist in `localStorage`.
- The app is intentionally frontend-only in v1: no payments, backend, or accounts.
