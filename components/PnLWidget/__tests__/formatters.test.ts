import { describe, expect, it } from 'vitest';
import {
  aggregateTotals,
  calcMarginPercent,
  formatChartTick,
  formatCurrency,
  formatFullDate,
  formatPercent,
  formatShortDate,
} from '../utils';
import type { PnLDataPoint } from '../types';

const makePoint = (overrides?: Partial<PnLDataPoint>): PnLDataPoint => ({
  date: '2024-01-15',
  revenue: 100_000,
  cost: 40_000,
  commissions: 8_000,
  logistics: 5_000,
  margin: 47_000,
  ...overrides,
});

describe('formatCurrency', () => {
  it('formats positive number with RUB symbol', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats negative number', () => {
    const result = formatCurrency(-5000);
    expect(result).toContain('5');
  });
});

describe('formatPercent', () => {
  it('formats percent with one decimal', () => {
    expect(formatPercent(12.345)).toBe('12.3%');
  });

  it('formats zero percent', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('rounds correctly', () => {
    expect(formatPercent(99.95)).toBe('100.0%');
  });
});

describe('formatShortDate', () => {
  it('returns dd.mm format', () => {
    const result = formatShortDate('2024-06-15');
    expect(result).toMatch(/\d{2}\.\d{2}/);
  });
});

describe('formatFullDate', () => {
  it('returns dd.mm.yyyy format', () => {
    const result = formatFullDate('2024-06-15');
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});

describe('formatChartTick', () => {
  it('abbreviates millions', () => {
    expect(formatChartTick(1_500_000)).toBe('1.5M');
  });

  it('abbreviates thousands', () => {
    expect(formatChartTick(45_000)).toBe('45K');
  });

  it('leaves small numbers as-is', () => {
    expect(formatChartTick(500)).toBe('500');
  });

  it('handles negative millions', () => {
    expect(formatChartTick(-2_000_000)).toBe('-2.0M');
  });
});

describe('calcMarginPercent', () => {
  it('calculates margin percent correctly', () => {
    const point = makePoint({ revenue: 100_000, margin: 47_000 });
    expect(calcMarginPercent(point)).toBeCloseTo(47);
  });

  it('returns 0 when revenue is 0', () => {
    const point = makePoint({ revenue: 0, margin: 0 });
    expect(calcMarginPercent(point)).toBe(0);
  });

  it('handles negative margin', () => {
    const point = makePoint({ revenue: 100_000, margin: -5_000 });
    expect(calcMarginPercent(point)).toBeCloseTo(-5);
  });
});

describe('aggregateTotals', () => {
  const points: PnLDataPoint[] = [
    makePoint({ date: '2024-01-01', revenue: 100_000, cost: 40_000, commissions: 8_000, logistics: 5_000, margin: 47_000 }),
    makePoint({ date: '2024-01-02', revenue: 120_000, cost: 50_000, commissions: 10_000, logistics: 6_000, margin: 54_000 }),
  ];

  it('sums all fields correctly', () => {
    const totals = aggregateTotals(points);
    expect(totals.revenue).toBe(220_000);
    expect(totals.cost).toBe(90_000);
    expect(totals.commissions).toBe(18_000);
    expect(totals.logistics).toBe(11_000);
    expect(totals.margin).toBe(101_000);
  });

  it('calculates marginPercent from totals', () => {
    const totals = aggregateTotals(points);
    expect(totals.marginPercent).toBeCloseTo((101_000 / 220_000) * 100);
  });

  it('returns zero marginPercent when revenue is 0', () => {
    const totals = aggregateTotals([makePoint({ revenue: 0, margin: 0 })]);
    expect(totals.marginPercent).toBe(0);
  });

  it('handles empty array', () => {
    const totals = aggregateTotals([]);
    expect(totals.revenue).toBe(0);
    expect(totals.margin).toBe(0);
    expect(totals.marginPercent).toBe(0);
  });
});
