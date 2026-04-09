import { FetchPnL, Period, PnLData, PnLDataPoint } from './types';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generatePoints(period: Period): PnLDataPoint[] {
  const rng = seededRandom(period * 137);
  const now = new Date();
  const points: PnLDataPoint[] = [];

  for (let i = period - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    const revenue = Math.round(80_000 + rng() * 120_000);
    const costRatio = 0.35 + rng() * 0.15;
    const commRatio = 0.08 + rng() * 0.06;
    const logRatio = 0.05 + rng() * 0.04;

    const cost = Math.round(revenue * costRatio);
    const commissions = Math.round(revenue * commRatio);
    const logistics = Math.round(revenue * logRatio);
    const margin = revenue - cost - commissions - logistics;

    points.push({ date: dateStr, revenue, cost, commissions, logistics, margin });
  }

  return points;
}

export const mockFetchPnL: FetchPnL = async (period: Period): Promise<PnLData> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { period, points: generatePoints(period) };
};

export const mockFetchPnLEmpty: FetchPnL = async (): Promise<PnLData> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { period: 7, points: [] };
};

export const mockFetchPnLError: FetchPnL = async (): Promise<PnLData> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  throw new Error('Не удалось загрузить данные P&L');
};
