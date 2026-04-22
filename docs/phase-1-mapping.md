# Phase 1 Mapping

## Visual / Architecture -> `taxnomad-183-day-calculator`

- Project shape: Vite + React + TypeScript with compact `src/components`, `src/contexts`, `src/lib`, `src/pages`.
- App bootstrap: `src/main.tsx`, `src/App.tsx`, router shell, providers, toaster placement.
- Visual system baseline: `src/index.css`, typography strategy, glass surfaces, premium gradients, token naming, spacing feel.
- UI primitives baseline: `src/components/ui/*` patterns and Radix-oriented component organization.
- Layout shell: header, premium hero shell, calculator page composition, summary-side layout.

## Logic / Features -> `calculadora-fiscal-183`

- Date range domain rules to port in later phases: overlap handling, contiguous/overlap merging, unique-day totals.
- Range lifecycle behavior to port in later phases: add, edit, delete, editing-index coordination.
- Stronger validation to port in later phases: invalid ordering, out-of-period checks, overlap prevention, edge-case messaging.
- Summary/business logic to port in later phases: 183-day thresholds, status labeling, progress semantics.
- Optional later-phase utilities: PDF/report generation and legal content, only if they fit the rebuilt TaxNomad shell cleanly.

## Excluded From V1

- Stripe and payment flows.
- Neon database and backend data services.
- Gemini integration.
- User accounts or onboarding systems.
- Ads, analytics-only widgets, and extra source-repo tooling without direct calculator value.
- Legacy visual patterns from `calculadora-fiscal-183`.

## Notes

- TaxNomad wins for structure and presentation.
- `calculadora-fiscal-183` wins only for business logic and useful edge cases.
- This repository is a clean rebuild, not a merge.
