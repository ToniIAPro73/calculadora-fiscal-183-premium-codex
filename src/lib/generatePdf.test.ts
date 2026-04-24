import { describe, expect, it } from 'vitest';
import { generateTaxReport } from '@/lib/generatePdf';
import { buildExampleReportPayload } from '@/lib/reportMetadata';
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
      email: 'alex@example.com',
      taxId: 'X1234567Z',
      ranges: buildManyShortRanges(45),
      fiscalYear: 2026,
      language: 'en',
    });

    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it('renders the selected fiscal year and language-specific labels', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      taxId: 'X1234567Z',
      ranges: [
        { start: new Date(2025, 0, 1), end: new Date(2025, 0, 1) },
        { start: new Date(2025, 0, 2), end: new Date(2025, 0, 2) },
      ],
      fiscalYear: 2025,
      language: 'es',
    });
    const output = doc.output();

    expect(output).toContain('Ejercicio fiscal: 2025');
    expect(output).toContain('alex@example.com');
    expect(output).toContain('Informe de Presencia para Residencia Fiscal');
    expect(output).toContain('PERIODOS DECLARADOS');
  });

  it('builds sample reports for the requested fiscal year', () => {
    const example = buildExampleReportPayload(2024);

    expect(example.fiscalYear).toBe(2024);
    expect(example.ranges.every((range) => range.start.getFullYear() === 2024 && range.end.getFullYear() === 2024)).toBe(true);
  });
});
