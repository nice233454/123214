'use client';

import { PnLDataPoint } from './types';
import { calcMarginPercent, formatCurrency, formatFullDate, formatPercent } from './utils';

interface PnLTableProps {
  data: PnLDataPoint[];
}

interface Column {
  key: string;
  label: string;
  align: 'left' | 'right';
  render: (point: PnLDataPoint) => string;
  colorFn?: (point: PnLDataPoint) => string;
}

const COLUMNS: Column[] = [
  {
    key: 'date',
    label: 'Дата',
    align: 'left',
    render: (p) => formatFullDate(p.date),
  },
  {
    key: 'revenue',
    label: 'Выручка',
    align: 'right',
    render: (p) => formatCurrency(p.revenue),
  },
  {
    key: 'cost',
    label: 'Себестоимость',
    align: 'right',
    render: (p) => formatCurrency(p.cost),
  },
  {
    key: 'commissions',
    label: 'Комиссии',
    align: 'right',
    render: (p) => formatCurrency(p.commissions),
  },
  {
    key: 'margin',
    label: 'Маржа',
    align: 'right',
    render: (p) => formatCurrency(p.margin),
    colorFn: (p) => (p.margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'),
  },
  {
    key: 'marginPercent',
    label: 'Маржинальность',
    align: 'right',
    render: (p) => formatPercent(calcMarginPercent(p)),
    colorFn: (p) => {
      const pct = calcMarginPercent(p);
      if (pct >= 20) return 'text-green-600 dark:text-green-400';
      if (pct >= 10) return 'text-amber-600 dark:text-amber-400';
      return 'text-red-600 dark:text-red-400';
    },
  },
];

export function PnLTable({ data }: PnLTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm" aria-label="Таблица P&L по дням">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : 'text-left',
                ].join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((point, idx) => (
            <tr
              key={point.date}
              className={[
                'border-b border-border last:border-0 transition-colors hover:bg-muted/30',
                idx % 2 === 0 ? 'bg-background' : 'bg-muted/10',
              ].join(' ')}
            >
              {COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={[
                    'px-4 py-3 whitespace-nowrap',
                    col.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                    col.colorFn ? col.colorFn(point) : 'text-foreground',
                    col.key === 'margin' || col.key === 'marginPercent' ? 'font-medium' : '',
                  ].join(' ')}
                >
                  {col.render(point)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
