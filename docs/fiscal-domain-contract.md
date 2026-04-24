# Fiscal Domain Contract

This contract defines the minimum behavior the calculator must preserve before production.

## Date Inputs

- Accepted domain inputs are `Date` objects or parseable date strings.
- Invalid dates must fail explicitly with `Invalid date provided.`.
- A period is inclusive: `2026-01-01` to `2026-01-01` is 1 day.
- A period with `end` before `start` is invalid and must fail with `Date range end cannot be before start.`.
- Caller-provided `days` values are not trusted. The domain always derives days from `start` and `end`.

## Fiscal Year

- The UI must use an explicit fiscal year selected by the user.
- Date drafts must stay within January 1 through December 31 of the selected fiscal year.
- Changing fiscal year clears existing ranges to avoid mixing exercises in a single summary.
- PDF reports must include the fiscal year used for the calculation.

## Range Merging

- Overlapping ranges are merged before calculating total unique days.
- Boundary overlaps count as overlap: `Jan 1-Jan 5` and `Jan 5-Jan 10` share 1 day.
- `hasOverlap` is true when any original ranges share at least one calendar day.
- `annotatedRanges[].overlapDays` counts days in the original range also used by another original range.

## 183-Day Status

- `safe`: `totalDays <= warningThreshold`.
- `warning`: `warningThreshold < totalDays <= limit`.
- `destructive`: `totalDays > limit`.
- Defaults are `warningThreshold = 150` and `limit = 183`.
- Percentage is capped at 100 for display.

## Reporting

- PDF totals must come from `calculateFiscalSummary`, never from duplicated report logic.
- PDF tables must paginate when period rows exceed one A4 page.
- Report errors may be logged as operational events, but names, document numbers, tax IDs, dates, and raw ranges must not be logged.

## Required Gates

- `npm run lint`
- `npm test`
- `npm run build`
- Generated-range tests must compare merged totals against an independent Set-of-days oracle.
