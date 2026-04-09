'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PnLDataPoint } from './types';
import { formatChartTick, formatCurrency, formatShortDate } from './utils';

interface PnLChartProps {
  data: PnLDataPoint[];
}

const COLORS = {
  revenue: '#3b82f6',
  cost: '#f59e0b',
  commissions: '#14b8a6',
  logistics: '#f97316',
  margin: '#22c55e',
};

const LABELS: Record<string, string> = {
  revenue: 'Выручка',
  cost: 'Себестоимость',
  commissions: 'Комиссии',
  logistics: 'Логистика',
  margin: 'Маржа',
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card shadow-xl p-3 min-w-[200px]">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-xs text-muted-foreground">{LABELS[item.name] ?? item.name}</span>
          </div>
          <span className="text-xs font-medium text-foreground">{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
      {Object.entries(LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{
              background: COLORS[key as keyof typeof COLORS],
              borderRadius: key === 'margin' ? '9999px' : '2px',
              height: key === 'margin' ? '2px' : '10px',
              width: key === 'margin' ? '16px' : '10px',
            }}
          />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function PnLChart({ data }: PnLChartProps) {
  const chartData = data.map((p) => ({
    ...p,
    date: formatShortDate(p.date),
  }));

  return (
    <div className="w-full" style={{ minHeight: 280 }}>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatChartTick}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
          <Bar dataKey="revenue" name="revenue" fill={COLORS.revenue} radius={[3, 3, 0, 0]} maxBarSize={32} />
          <Bar dataKey="cost" name="cost" stackId="costs" fill={COLORS.cost} maxBarSize={32} />
          <Bar dataKey="commissions" name="commissions" stackId="costs" fill={COLORS.commissions} maxBarSize={32} />
          <Bar dataKey="logistics" name="logistics" stackId="costs" fill={COLORS.logistics} radius={[3, 3, 0, 0]} maxBarSize={32} />
          <Line
            dataKey="margin"
            name="margin"
            type="monotone"
            stroke={COLORS.margin}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.margin, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}
