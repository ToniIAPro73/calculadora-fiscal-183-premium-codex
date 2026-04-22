import type { DateRangeInput } from '@/lib/dateRangeMerger';

export const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  address: 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain',
  nif: '08997554T',
  email: 'hola@regla183.com',
  website: 'regla183.com',
};

export function buildExampleReportPayload() {
  return {
    name: 'Alex Rivera',
    documentType: 'passport',
    taxId: 'X1234567Z',
    ranges: [
      { start: new Date('2026-01-05'), end: new Date('2026-01-20') },
      { start: new Date('2026-01-18'), end: new Date('2026-01-28') },
      { start: new Date('2026-03-02'), end: new Date('2026-03-18') },
      { start: new Date('2026-08-11'), end: new Date('2026-08-23') },
    ] satisfies DateRangeInput[],
    exampleMode: true,
  };
}
