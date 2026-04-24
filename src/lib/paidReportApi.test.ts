import { describe, expect, it } from 'vitest';
import { generatePaidTaxReport } from '../../api/_generateTaxReport';

describe('generatePaidTaxReport', () => {
  it('renders paid server-side reports in English when requested', async () => {
    const doc = await generatePaidTaxReport({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      taxId: 'X1234567Z',
      documentType: 'passport',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: '2026-04-01', end: '2026-04-02' }],
    });
    const output = doc.output();

    expect(output).toContain('Fiscal Residency Presence Report');
    expect(output).toContain('DECLARED PERIODS');
    expect(output).toContain('Fiscal year: 2026');
    expect(output).not.toContain('Informe de Presencia para Residencia Fiscal');
    expect(output).not.toContain('Periodos declarados');
  });
});
