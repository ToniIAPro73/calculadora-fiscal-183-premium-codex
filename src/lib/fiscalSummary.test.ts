import { describe, expect, it } from 'vitest';
import { calculateFiscalSummary, getFiscalStatus } from '@/lib/fiscalSummary';

describe('fiscalSummary', () => {
  it('builds a safe summary below the warning threshold', () => {
    const summary = calculateFiscalSummary([
      { start: new Date('2026-01-01'), end: new Date('2026-02-15') },
    ]);

    expect(summary.totalDays).toBe(46);
    expect(summary.remainingDays).toBe(137);
    expect(summary.exceededDays).toBe(0);
    expect(summary.status).toBe('safe');
    expect(summary.percentageUsed).toBeCloseTo((46 / 183) * 100, 5);
  });

  it('reports warning and destructive states at the expected thresholds', () => {
    expect(getFiscalStatus(151)).toBe('warning');
    expect(getFiscalStatus(183)).toBe('warning');
    expect(getFiscalStatus(184)).toBe('destructive');
  });

  it('caps percentage at 100 and preserves overlap metadata', () => {
    const summary = calculateFiscalSummary([
      { start: new Date('2026-01-01'), end: new Date('2026-04-30') },
      { start: new Date('2026-04-15'), end: new Date('2026-07-15') },
    ]);

    expect(summary.hasOverlap).toBe(true);
    expect(summary.annotatedRanges[0].overlapDays).toBeGreaterThan(0);
    expect(summary.percentageUsed).toBe(100);
    expect(summary.status).toBe('destructive');
  });
});
