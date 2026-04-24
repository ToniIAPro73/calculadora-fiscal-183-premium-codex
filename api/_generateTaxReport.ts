import { jsPDF } from 'jspdf';
import { differenceInCalendarDays, eachDayOfInterval, format, isBefore, isValid, max, startOfDay } from 'date-fns';
import type { SerializedReportRange } from './_reportPayload.js';

type DateRange = {
  start: Date;
  end: Date;
  days: number;
};

type AnnotatedRange = DateRange & {
  overlapDays: number;
};

type GenerateTaxReportParams = {
  name: string;
  email?: string;
  taxId: string;
  documentType?: string;
  ranges: SerializedReportRange[];
  fiscalYear?: number;
  language?: 'en' | 'es';
};

const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  nif: '08997554T',
  email: 'hola@regla183.com',
  website: 'regla183.com',
};

const labels = {
  en: {
    title: 'Fiscal Residency Presence Report',
    subtitle: '183-day fiscal monitoring summary',
    generated: 'Generated',
    reportFor: 'Report holder',
    email: 'Email',
    identifier: 'Identifier',
    trackedDays: 'Tracked unique days',
    remainingDays: 'Remaining to threshold',
    status: 'Status',
    dateRanges: 'Declared periods',
    from: 'From',
    to: 'To',
    days: 'Days',
    overlap: 'Overlap',
    threshold: 'Threshold',
    fiscalYear: 'Fiscal year',
    notes:
      'This report is an informational aid. It does not replace formal tax or legal advice and depends on the accuracy of user-provided date ranges.',
    passport: 'Passport',
    nie: 'NIE',
    safe: 'Safe',
    warning: 'Approaching limit',
    destructive: 'Over limit',
    no: 'No',
  },
  es: {
    title: 'Informe de Presencia para Residencia Fiscal',
    subtitle: 'Resumen de seguimiento del umbral de 183 dias',
    generated: 'Generado',
    reportFor: 'Titular del informe',
    email: 'Email',
    identifier: 'Identificacion',
    trackedDays: 'Dias unicos contabilizados',
    remainingDays: 'Restantes hasta el umbral',
    status: 'Estado',
    dateRanges: 'Periodos declarados',
    from: 'Desde',
    to: 'Hasta',
    days: 'Dias',
    overlap: 'Solape',
    threshold: 'Umbral',
    fiscalYear: 'Ejercicio fiscal',
    notes:
      'Este informe es una ayuda informativa. No sustituye asesoramiento fiscal o legal formal y depende de la exactitud de los rangos de fechas introducidos.',
    passport: 'Pasaporte',
    nie: 'NIE',
    safe: 'Seguro',
    warning: 'Cerca del limite',
    destructive: 'Limite superado',
    no: 'No',
  },
} as const;

function normalizeDate(date: Date | string) {
  const normalized = startOfDay(new Date(date));
  if (!isValid(normalized)) {
    throw new Error('Invalid date provided.');
  }
  return normalized;
}

function calculateRangeDays(start: Date | string, end: Date | string) {
  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);

  if (isBefore(normalizedEnd, normalizedStart)) {
    throw new Error('Date range end cannot be before start.');
  }

  return differenceInCalendarDays(normalizedEnd, normalizedStart) + 1;
}

function normalizeDateRange(range: SerializedReportRange): DateRange {
  const start = normalizeDate(range.start);
  const end = normalizeDate(range.end);

  return {
    start,
    end,
    days: calculateRangeDays(start, end),
  };
}

function toDayKey(date: Date) {
  return format(normalizeDate(date), 'yyyy-MM-dd');
}

function mergeDateRanges(ranges: SerializedReportRange[]) {
  const normalizedRanges = ranges.map(normalizeDateRange);
  const sortedRanges = [...normalizedRanges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: DateRange[] = sortedRanges.length > 0 ? [{ ...sortedRanges[0] }] : [];

  for (let index = 1; index < sortedRanges.length; index += 1) {
    const current = sortedRanges[index];
    const lastMerged = merged[merged.length - 1];

    if (current.start <= lastMerged.end) {
      lastMerged.end = max([lastMerged.end, current.end]);
      lastMerged.days = calculateRangeDays(lastMerged.start, lastMerged.end);
      continue;
    }

    merged.push({ ...current });
  }

  const dayUsage = new Map<string, number>();
  normalizedRanges.forEach((range) => {
    eachDayOfInterval({ start: range.start, end: range.end }).forEach((day) => {
      const key = toDayKey(day);
      dayUsage.set(key, (dayUsage.get(key) ?? 0) + 1);
    });
  });

  const annotatedRanges: AnnotatedRange[] = normalizedRanges.map((range) => {
    const overlapDays = eachDayOfInterval({ start: range.start, end: range.end }).reduce((count, day) => {
      return count + ((dayUsage.get(toDayKey(day)) ?? 0) > 1 ? 1 : 0);
    }, 0);

    return { ...range, overlapDays };
  });

  return { merged, annotatedRanges };
}

function statusLabel(language: 'en' | 'es', totalDays: number) {
  if (totalDays > 183) return labels[language].destructive;
  if (totalDays > 150) return labels[language].warning;
  return labels[language].safe;
}

export async function generatePaidTaxReport({
  name,
  email,
  taxId,
  documentType = 'passport',
  ranges,
  fiscalYear,
  language = 'es',
}: GenerateTaxReportParams) {
  const copy = labels[language];
  const { merged, annotatedRanges } = mergeDateRanges(ranges);
  const totalDays = merged.reduce((sum, range) => sum + range.days, 0);
  const remainingDays = Math.max(183 - totalDays, 0);
  const reportFiscalYear = fiscalYear ?? merged[0]?.start.getFullYear() ?? new Date().getFullYear();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = width - margin * 2;
  const bottomLimit = height - 24;
  const generatedAt = format(new Date(), 'yyyy-MM-dd HH:mm');
  const rows = annotatedRanges.map((range) => [
    format(range.start, 'yyyy-MM-dd'),
    format(range.end, 'yyyy-MM-dd'),
    String(range.days),
    range.overlapDays > 0 ? String(range.overlapDays) : copy.no,
  ]);

  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, width, 34, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('FISCAL 183', margin, 15);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(copy.title, margin, 22);
  doc.setTextColor(191, 219, 254);
  doc.setFontSize(8);
  doc.text(copy.subtitle, margin, 27);

  doc.setFillColor(16, 185, 129);
  doc.roundedRect(width - margin - 42, 21, 42, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`${copy.fiscalYear}: ${reportFiscalYear}`.toUpperCase(), width - margin - 21, 26, { align: 'center' });

  let y = 46;

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(copy.reportFor.toUpperCase(), margin, y);
  y += 6;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`${copy.reportFor}:`, margin + 5, y + 8);
  doc.text(`${copy.identifier}:`, margin + contentWidth / 2, y + 8);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(name, margin + 34, y + 8);
  doc.text(`${documentType === 'nie' ? copy.nie : copy.passport} · ${taxId}`, margin + contentWidth / 2 + 24, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${copy.generated}: ${generatedAt}`, margin + 5, y + 16);
  doc.text(`${copy.fiscalYear}: ${reportFiscalYear} · ${copy.threshold}: 183`, margin + contentWidth / 2, y + 16);
  if (email) {
    doc.text(`${copy.email}:`, margin + 5, y + 24);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(email, margin + 34, y + 24);
    doc.setFont('helvetica', 'normal');
  }
  y += 40;

  const cards = [
    [copy.trackedDays, `${totalDays}`],
    [copy.remainingDays, `${remainingDays}`],
    [copy.status, statusLabel(language, totalDays)],
  ] as const;

  cards.forEach(([label, value], index) => {
    const cardX = margin + index * ((contentWidth - 8) / 3 + 4);
    const cardWidth = (contentWidth - 8) / 3;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardWidth, 22, 3, 3, 'FD');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), cardX + 4, y + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(value, cardX + 4, y + 16);
    doc.setFont('helvetica', 'normal');
  });
  y += 32;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(copy.dateRanges.toUpperCase(), margin, y);
  y += 7;

  const colWidths = [42, 42, 22, 22];
  const headerRow = [copy.from, copy.to, copy.days, copy.overlap];
  const tableWidth = colWidths.reduce((sum, value) => sum + value, 0);
  const drawTableHeader = (headerY: number) => {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, headerY, tableWidth, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    let currentX = margin;
    headerRow.forEach((value, index) => {
      doc.text(value.toUpperCase(), currentX + 3, headerY + 5.2);
      currentX += colWidths[index];
    });

    return headerY + 8;
  };

  y = drawTableHeader(y);

  rows.forEach((row, index) => {
    if (y + 8 > bottomLimit) {
      doc.addPage();
      y = drawTableHeader(24);
    }

    const fill = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.rect(margin, y, tableWidth, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    let rowX = margin;
    row.forEach((value, valueIndex) => {
      doc.text(value, rowX + 3, y + 5.2);
      rowX += colWidths[valueIndex];
    });
    y += 8;
  });

  if (y + 28 > bottomLimit) {
    doc.addPage();
    y = 24;
  }

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, width - margin, y);
  y += 8;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(copy.notes, margin, y, { maxWidth: contentWidth });

  const footerText = `${reportOwner.name} · ${reportOwner.nif} · ${reportOwner.email} · ${reportOwner.website}`;
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(7);
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setTextColor(100, 116, 139);
    doc.text(footerText, margin, height - 10);
  }

  return doc;
}
