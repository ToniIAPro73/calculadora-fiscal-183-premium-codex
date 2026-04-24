import type { DateRange } from '@/lib/dateRangeMerger';
import type { ReportDocumentType, ReportLanguage } from '@/lib/reportPayload';

export async function createCheckoutSession(params: {
  name: string;
  documentType: ReportDocumentType;
  taxId: string;
  fiscalYear: number;
  language: ReportLanguage;
  ranges: DateRange[];
}) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: params.name,
      documentType: params.documentType,
      taxId: params.taxId,
      fiscalYear: params.fiscalYear,
      language: params.language,
      ranges: params.ranges.map((range) => ({
        start: range.start.toISOString().slice(0, 10),
        end: range.end.toISOString().slice(0, 10),
      })),
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? 'Unable to start checkout.');
  }

  return result.url as string;
}
