export type ReportDocumentType = 'passport' | 'nie';
export type ReportLanguage = 'en' | 'es';

export type SerializedReportRange = {
  start: string;
  end: string;
};

export type ReportCheckoutPayload = {
  name: string;
  documentType: ReportDocumentType;
  taxId: string;
  fiscalYear: number;
  language: ReportLanguage;
  ranges: SerializedReportRange[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeIsoDate(value: unknown) {
  if (typeof value !== 'string') {
    throw new Error('Invalid date range payload.');
  }

  const normalized = value.slice(0, 10);
  const parsed = new Date(`${normalized}T00:00:00.000Z`);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized) || Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date range payload.');
  }

  return normalized;
}

function getUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function normalizeReportCheckoutPayload(input: unknown, today = new Date()): ReportCheckoutPayload {
  if (!isRecord(input)) {
    throw new Error('Invalid report payload.');
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const taxId = typeof input.taxId === 'string' ? input.taxId.trim() : '';
  const documentType = input.documentType === 'nie' ? 'nie' : input.documentType === 'passport' ? 'passport' : null;
  const language = input.language === 'en' ? 'en' : input.language === 'es' ? 'es' : null;
  const fiscalYear = typeof input.fiscalYear === 'number' ? input.fiscalYear : Number(input.fiscalYear);

  if (name.length < 2 || name.length > 140) {
    throw new Error('Report holder name is required.');
  }
  if (taxId.length < 2 || taxId.length > 64) {
    throw new Error('Document number is required.');
  }
  if (!documentType) {
    throw new Error('Document type is invalid.');
  }
  if (!language) {
    throw new Error('Report language is invalid.');
  }
  if (!Number.isInteger(fiscalYear) || fiscalYear < 1900 || fiscalYear > today.getFullYear()) {
    throw new Error('Fiscal year is invalid.');
  }
  if (!Array.isArray(input.ranges) || input.ranges.length === 0 || input.ranges.length > 100) {
    throw new Error('At least one date range is required.');
  }

  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const ranges = input.ranges.map((range) => {
    if (!isRecord(range)) {
      throw new Error('Invalid date range payload.');
    }

    const start = normalizeIsoDate(range.start);
    const end = normalizeIsoDate(range.end);
    const startDate = getUtcDate(start);
    const endDate = getUtcDate(end);

    if (startDate.getUTCFullYear() !== fiscalYear || endDate.getUTCFullYear() !== fiscalYear) {
      throw new Error('Date ranges must stay inside the selected fiscal year.');
    }
    if (endDate < startDate) {
      throw new Error('Date range end cannot be before start.');
    }
    if (startDate > todayUtc || endDate > todayUtc) {
      throw new Error('Date ranges cannot include future dates.');
    }

    return { start, end };
  });

  return {
    name,
    documentType,
    taxId,
    fiscalYear,
    language,
    ranges,
  };
}
