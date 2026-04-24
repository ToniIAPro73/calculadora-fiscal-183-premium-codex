import { describe, expect, it } from 'vitest';
import { generateTaxReport } from '@/lib/generatePdf';
import type { DateRangeInput } from '@/lib/dateRangeMerger';

function buildManyShortRanges(count: number): DateRangeInput[] {
  return Array.from({ length: count }, (_, index) => {
    const day = index + 1;

    return {
      start: new Date(2026, 0, day),
      end: new Date(2026, 0, day),
    };
  });
}

describe('generateTaxReport', () => {
  it('adds pages when declared periods exceed the first-page table capacity', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      ranges: buildManyShortRanges(45),
      fiscalYear: 2026,
      language: 'en',
    });

    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });
});
