import type { DateRangeInput } from '@/lib/dateRangeMerger';

export const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  address: 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain',
  nif: '08997554T',
  email: 'hola@regla183.com',
  website: 'regla183.com',
};

function getDayOfYear(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
}

function buildSampleRange(fiscalYear: number, startDay: number, length: number, maxDay: number) {
  const safeStartDay = Math.max(1, Math.min(startDay, maxDay));
  const safeEndDay = Math.max(safeStartDay, Math.min(safeStartDay + length, maxDay));

  return {
    start: new Date(fiscalYear, 0, safeStartDay),
    end: new Date(fiscalYear, 0, safeEndDay),
  };
}

export function buildExampleReportPayload(fiscalYear = new Date().getFullYear()) {
  const today = new Date();
  const maxSampleDay = fiscalYear === today.getFullYear() ? getDayOfYear(today) : 365;

  return {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    documentType: 'passport',
    taxId: 'X1234567Z',
    fiscalYear,
    ranges: [
      buildSampleRange(fiscalYear, 5, 15, maxSampleDay),
      buildSampleRange(fiscalYear, 18, 10, maxSampleDay),
      buildSampleRange(fiscalYear, 61, 16, maxSampleDay),
      buildSampleRange(fiscalYear, 96, 12, maxSampleDay),
    ] satisfies DateRangeInput[],
    exampleMode: true,
  };
}
