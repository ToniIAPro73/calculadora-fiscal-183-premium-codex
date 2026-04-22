import { calculateUniqueDays, mergeDateRanges, type AnnotatedRange, type DateRange, type DateRangeInput } from '@/lib/dateRangeMerger';

export type FiscalStatus = 'safe' | 'warning' | 'destructive';

export type FiscalSummary = {
  limit: number;
  warningThreshold: number;
  totalDays: number;
  remainingDays: number;
  exceededDays: number;
  percentageUsed: number;
  hasOverlap: boolean;
  status: FiscalStatus;
  mergedRanges: DateRange[];
  annotatedRanges: AnnotatedRange[];
};

export function getFiscalStatus(totalDays: number, warningThreshold = 150, limit = 183): FiscalStatus {
  if (totalDays > limit) return 'destructive';
  if (totalDays > warningThreshold) return 'warning';
  return 'safe';
}

export function calculateFiscalSummary(
  ranges: DateRangeInput[],
  options?: {
    limit?: number;
    warningThreshold?: number;
  },
): FiscalSummary {
  const limit = options?.limit ?? 183;
  const warningThreshold = options?.warningThreshold ?? 150;
  const { merged, hasOverlap, annotatedRanges } = mergeDateRanges(ranges);
  const totalDays = calculateUniqueDays(merged);
  const remainingDays = Math.max(limit - totalDays, 0);
  const exceededDays = Math.max(totalDays - limit, 0);
  const percentageUsed = Math.min((totalDays / limit) * 100, 100);

  return {
    limit,
    warningThreshold,
    totalDays,
    remainingDays,
    exceededDays,
    percentageUsed,
    hasOverlap,
    status: getFiscalStatus(totalDays, warningThreshold, limit),
    mergedRanges: merged,
    annotatedRanges,
  };
}
