export type Period = 7 | 30 | 90;

export interface PnLDataPoint {
  date: string;
  revenue: number;
  cost: number;
  commissions: number;
  logistics: number;
  margin: number;
}

export interface PnLData {
  period: Period;
  points: PnLDataPoint[];
}

export type FetchPnL = (period: Period) => Promise<PnLData>;

export type WidgetState = 'idle' | 'loading' | 'success' | 'error' | 'empty';
