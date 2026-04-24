import { describe, expect, it } from 'vitest';
import { normalizeReportCheckoutPayload } from '@/lib/reportPayload';

const today = new Date('2026-04-24T12:00:00.000Z');

describe('normalizeReportCheckoutPayload', () => {
  it('normalizes a valid paid report payload', () => {
    expect(
      normalizeReportCheckoutPayload(
        {
          name: ' Alex Rivera ',
          documentType: 'passport',
          taxId: ' X1234567Z ',
          fiscalYear: 2026,
          language: 'es',
          ranges: [{ start: '2026-04-01T00:00:00.000Z', end: '2026-04-10T00:00:00.000Z' }],
        },
        today,
      ),
    ).toEqual({
      name: 'Alex Rivera',
      documentType: 'passport',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'es',
      ranges: [{ start: '2026-04-01', end: '2026-04-10' }],
    });
  });

  it('rejects future dates and mixed fiscal years server-side', () => {
    expect(() =>
      normalizeReportCheckoutPayload(
        {
          name: 'Alex Rivera',
          documentType: 'nie',
          taxId: 'X1234567Z',
          fiscalYear: 2026,
          language: 'en',
          ranges: [{ start: '2026-04-20', end: '2026-04-25' }],
        },
        today,
      ),
    ).toThrow('Date ranges cannot include future dates.');

    expect(() =>
      normalizeReportCheckoutPayload(
        {
          name: 'Alex Rivera',
          documentType: 'nie',
          taxId: 'X1234567Z',
          fiscalYear: 2026,
          language: 'en',
          ranges: [{ start: '2025-12-31', end: '2026-01-01' }],
        },
        today,
      ),
    ).toThrow('Date ranges must stay inside the selected fiscal year.');
  });
});
