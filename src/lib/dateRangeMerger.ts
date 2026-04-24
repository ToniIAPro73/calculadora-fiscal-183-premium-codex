import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isValid,
  max,
  parseISO,
  startOfDay,
} from 'date-fns';

export type DateLike = Date | string;

export type DateRange = {
  start: Date;
  end: Date;
  days: number;
};

export type DateRangeInput = {
  start: DateLike;
  end: DateLike;
  days?: number;
};

export type AnnotatedRange = DateRange & {
  overlapDays: number;
};

export type DateRangeValidationCode =
  | 'missing_start'
  | 'missing_end'
  | 'outside_exercise'
  | 'future_date'
  | 'invalid_order'
  | 'overlap';

export type DateRangeValidationResult = {
  valid: boolean;
  code: DateRangeValidationCode | null;
};

export function normalizeDate(date: DateLike) {
  const normalized = startOfDay(new Date(date));
  if (!isValid(normalized)) {
    throw new Error('Invalid date provided.');
  }
  return normalized;
}

export function calculateRangeDays(start: DateLike, end: DateLike) {
  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);

  if (isBefore(normalizedEnd, normalizedStart)) {
    throw new Error('Date range end cannot be before start.');
  }

  return differenceInCalendarDays(normalizedEnd, normalizedStart) + 1;
}

export function normalizeDateRange(range: DateRangeInput): DateRange {
  const start = normalizeDate(range.start);
  const end = normalizeDate(range.end);

  return {
    start,
    end,
    days: calculateRangeDays(start, end),
  };
}

export function toDayKey(date: DateLike) {
  return format(normalizeDate(date), 'yyyy-MM-dd');
}

export function toInputValue(date: DateLike | null | undefined) {
  return date ? format(normalizeDate(date), 'yyyy/MM/dd') : '';
}

export function parseInputDate(value: string) {
  if (!value) return null;
  const normalizedValue = value.replace(/\./g, '/').replace(/-/g, '/');
  const isoLikeValue = normalizedValue.replace(/\//g, '-');
  const parsedDate = parseISO(isoLikeValue);
  return isValid(parsedDate) ? startOfDay(parsedDate) : null;
}

export function isOutsideExercise(date: DateLike, exerciseStart: DateLike, exerciseEnd: DateLike) {
  const candidate = normalizeDate(date);
  return isBefore(candidate, normalizeDate(exerciseStart)) || isAfter(candidate, normalizeDate(exerciseEnd));
}

export function collectOccupiedDayKeys(ranges: DateRangeInput[], excludeIndex?: number) {
  const keys = new Set<string>();

  ranges.forEach((range, index) => {
    if (excludeIndex !== undefined && index === excludeIndex) {
      return;
    }

    const normalizedRange = normalizeDateRange(range);
    eachDayOfInterval({ start: normalizedRange.start, end: normalizedRange.end }).forEach((day) => {
      keys.add(toDayKey(day));
    });
  });

  return keys;
}

export function rangeContainsOccupiedDays(
  start: DateLike | null | undefined,
  end: DateLike | null | undefined,
  occupiedDayKeys: ReadonlySet<string>,
) {
  if (!start || !end) return false;

  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);
  const safeStart = isAfter(normalizedStart, normalizedEnd) ? normalizedEnd : normalizedStart;
  const safeEnd = isAfter(normalizedStart, normalizedEnd) ? normalizedStart : normalizedEnd;

  return eachDayOfInterval({ start: safeStart, end: safeEnd }).some((day) => occupiedDayKeys.has(toDayKey(day)));
}

export function validateDateRangeDraft(params: {
  draftStart: DateLike | null | undefined;
  draftEnd: DateLike | null | undefined;
  hasInput?: boolean;
  exerciseStart: DateLike;
  exerciseEnd: DateLike;
  maxAllowedDate?: DateLike;
  occupiedDayKeys: ReadonlySet<string>;
}): DateRangeValidationResult {
  const { draftStart, draftEnd, hasInput = true, exerciseStart, exerciseEnd, maxAllowedDate, occupiedDayKeys } = params;

  if (!hasInput && !draftStart && !draftEnd) {
    return { valid: true, code: null };
  }
  if (!draftStart) {
    return { valid: false, code: 'missing_start' };
  }
  if (!draftEnd) {
    return { valid: false, code: 'missing_end' };
  }
  if (isOutsideExercise(draftStart, exerciseStart, exerciseEnd) || isOutsideExercise(draftEnd, exerciseStart, exerciseEnd)) {
    return { valid: false, code: 'outside_exercise' };
  }
  if (maxAllowedDate && (isAfter(normalizeDate(draftStart), normalizeDate(maxAllowedDate)) || isAfter(normalizeDate(draftEnd), normalizeDate(maxAllowedDate)))) {
    return { valid: false, code: 'future_date' };
  }
  if (isBefore(normalizeDate(draftEnd), normalizeDate(draftStart))) {
    return { valid: false, code: 'invalid_order' };
  }
  if (rangeContainsOccupiedDays(draftStart, draftEnd, occupiedDayKeys)) {
    return { valid: false, code: 'overlap' };
  }

  return { valid: true, code: null };
}

export function mergeDateRanges(ranges: DateRangeInput[]) {
  if (!ranges || ranges.length === 0) {
    return { merged: [] as DateRange[], hasOverlap: false, annotatedRanges: [] as AnnotatedRange[] };
  }

  const normalizedRanges = ranges.map(normalizeDateRange);
  const sortedRanges = [...normalizedRanges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: DateRange[] = [{ ...sortedRanges[0] }];
  let hasOverlap = false;

  for (let index = 1; index < sortedRanges.length; index += 1) {
    const current = sortedRanges[index];
    const lastMerged = merged[merged.length - 1];

    if (current.start <= lastMerged.end) {
      hasOverlap = true;
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

  return {
    merged,
    hasOverlap,
    annotatedRanges,
  };
}

export function calculateUniqueDays(ranges: DateRangeInput[]) {
  return ranges.map(normalizeDateRange).reduce((sum, range) => sum + range.days, 0);
}
