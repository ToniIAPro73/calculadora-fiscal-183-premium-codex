import { describe, expect, it } from 'vitest';
import {
  calculateRangeDays,
  calculateUniqueDays,
  collectOccupiedDayKeys,
  mergeDateRanges,
  parseInputDate,
  rangeContainsOccupiedDays,
  toDayKey,
  toInputValue,
  validateDateRangeDraft,
} from '@/lib/dateRangeMerger';

function dayOfYearToDate(year: number, dayOfYear: number) {
  return new Date(year, 0, dayOfYear + 1);
}

function buildSeededRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function calculateUniqueDaysWithOracle(ranges: { start: Date; end: Date }[]) {
  const occupiedDays = new Set<string>();

  ranges.forEach((range) => {
    const cursor = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
    const end = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());

    while (cursor.getTime() <= end.getTime()) {
      occupiedDays.add(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`,
      );
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return occupiedDays.size;
}

describe('dateRangeMerger', () => {
  it('merges overlapping ranges and calculates unique days', () => {
    const result = mergeDateRanges([
      { start: new Date('2026-01-01'), end: new Date('2026-01-05') },
      { start: new Date('2026-01-03'), end: new Date('2026-01-07') },
      { start: new Date('2026-02-10'), end: new Date('2026-02-12') },
    ]);

    expect(result.hasOverlap).toBe(true);
    expect(result.merged).toHaveLength(2);
    expect(result.merged[0].days).toBe(7);
    expect(result.merged[1].days).toBe(3);
    expect(calculateUniqueDays(result.merged)).toBe(10);
  });

  it('always derives range days from dates instead of trusting caller-provided days', () => {
    const result = mergeDateRanges([
      { start: new Date('2026-01-01'), end: new Date('2026-01-10'), days: 999 },
    ]);

    expect(result.merged[0].days).toBe(10);
    expect(calculateUniqueDays(result.merged)).toBe(10);
  });

  it('rejects inverted ranges at the domain boundary', () => {
    expect(() => calculateRangeDays(new Date('2026-05-10'), new Date('2026-05-01'))).toThrow(
      'Date range end cannot be before start.',
    );
    expect(() =>
      mergeDateRanges([{ start: new Date('2026-05-10'), end: new Date('2026-05-01') }]),
    ).toThrow('Date range end cannot be before start.');
  });

  it('counts inclusive boundary overlaps only once in the merged total', () => {
    const result = mergeDateRanges([
      { start: new Date('2026-01-01'), end: new Date('2026-01-05') },
      { start: new Date('2026-01-05'), end: new Date('2026-01-10') },
    ]);

    expect(result.hasOverlap).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].days).toBe(10);
    expect(result.annotatedRanges[0].overlapDays).toBe(1);
    expect(result.annotatedRanges[1].overlapDays).toBe(1);
  });

  it('counts leap-day ranges inclusively', () => {
    expect(calculateRangeDays(new Date('2024-02-28'), new Date('2024-03-01'))).toBe(3);
  });

  it('matches an independent unique-day oracle across deterministic generated ranges', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const random = buildSeededRandom(seed);
      const ranges = Array.from({ length: 24 }, () => {
        const startDay = Math.floor(random() * 350);
        const length = Math.floor(random() * 20);

        return {
          start: dayOfYearToDate(2026, startDay),
          end: dayOfYearToDate(2026, Math.min(startDay + length, 364)),
        };
      });
      const result = mergeDateRanges(ranges);

      expect(calculateUniqueDays(result.merged)).toBe(calculateUniqueDaysWithOracle(ranges));
    }
  });

  it('annotates overlap days per original range', () => {
    const result = mergeDateRanges([
      { start: new Date('2026-01-01'), end: new Date('2026-01-05') },
      { start: new Date('2026-01-03'), end: new Date('2026-01-07') },
    ]);

    expect(result.annotatedRanges[0].overlapDays).toBe(3);
    expect(result.annotatedRanges[1].overlapDays).toBe(3);
  });

  it('collects occupied day keys and supports excluding the edited range', () => {
    const occupied = collectOccupiedDayKeys(
      [
        { start: new Date('2026-01-01'), end: new Date('2026-01-03') },
        { start: new Date('2026-01-10'), end: new Date('2026-01-11') },
      ],
      1,
    );

    expect(occupied.has('2026-01-01')).toBe(true);
    expect(occupied.has('2026-01-10')).toBe(false);
  });

  it('detects occupied days inside a candidate range', () => {
    const occupied = new Set(['2026-01-04', '2026-01-05']);
    expect(rangeContainsOccupiedDays(new Date('2026-01-01'), new Date('2026-01-03'), occupied)).toBe(false);
    expect(rangeContainsOccupiedDays(new Date('2026-01-03'), new Date('2026-01-06'), occupied)).toBe(true);
  });

  it('validates draft ranges against missing values, ordering, exercise bounds, and overlap', () => {
    const occupied = new Set(['2026-06-05']);

    expect(
      validateDateRangeDraft({
        draftStart: null,
        draftEnd: null,
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }).code,
    ).toBe('missing_start');

    expect(
      validateDateRangeDraft({
        draftStart: new Date('2026-06-02'),
        draftEnd: null,
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }).code,
    ).toBe('missing_end');

    expect(
      validateDateRangeDraft({
        draftStart: new Date('2025-12-31'),
        draftEnd: new Date('2026-01-02'),
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }).code,
    ).toBe('outside_exercise');

    expect(
      validateDateRangeDraft({
        draftStart: new Date('2026-06-10'),
        draftEnd: new Date('2026-06-08'),
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }).code,
    ).toBe('invalid_order');

    expect(
      validateDateRangeDraft({
        draftStart: new Date('2026-06-04'),
        draftEnd: new Date('2026-06-06'),
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }).code,
    ).toBe('overlap');

    expect(
      validateDateRangeDraft({
        draftStart: new Date('2026-06-07'),
        draftEnd: new Date('2026-06-09'),
        hasInput: true,
        exerciseStart: new Date('2026-01-01'),
        exerciseEnd: new Date('2026-12-31'),
        occupiedDayKeys: occupied,
      }),
    ).toEqual({ valid: true, code: null });
  });

  it('normalizes input helpers consistently', () => {
    expect(toDayKey(parseInputDate('2026/04/22')!)).toBe('2026-04-22');
    expect(toDayKey(parseInputDate('2026-04-22')!)).toBe('2026-04-22');
    expect(toDayKey(parseInputDate('2026.04.22')!)).toBe('2026-04-22');
    expect(toInputValue(new Date('2026-04-22'))).toBe('2026/04/22');
    expect(toDayKey(new Date('2026-04-22'))).toBe('2026-04-22');
    expect(calculateRangeDays(new Date('2026-04-22'), new Date('2026-04-24'))).toBe(3);
  });
});
