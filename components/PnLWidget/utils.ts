import { PnLDataPoint } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function calcMarginPercent(point: PnLDataPoint): number {
  if (point.revenue === 0) return 0;
  return (point.margin / point.revenue) * 100;
}

export function aggregateTotals(points: PnLDataPoint[]): PnLDataPoint & { marginPercent: number } {
  const totals = points.reduce(
    (acc, p) => ({
      date: '',
      revenue: acc.revenue + p.revenue,
      cost: acc.cost + p.cost,
      commissions: acc.commissions + p.commissions,
      logistics: acc.logistics + p.logistics,
      margin: acc.margin + p.margin,
    }),
    { date: '', revenue: 0, cost: 0, commissions: 0, logistics: 0, margin: 0 }
  );
  return {
    ...totals,
    marginPercent: totals.revenue > 0 ? (totals.margin / totals.revenue) * 100 : 0,
  };
}

export function formatChartTick(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}
