'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleAlert as AlertCircle, ChartBar as BarChart3, RefreshCw, TrendingUp } from 'lucide-react';
import { FetchPnL, Period, PnLData, WidgetState } from './types';
import { PeriodSwitcher } from './PeriodSwitcher';
import { PnLChart } from './PnLChart';
import { PnLTable } from './PnLTable';
import { PnLSkeleton } from './PnLSkeleton';
import { aggregateTotals, formatCurrency, formatPercent } from './utils';

interface PnLWidgetProps {
  fetchPnL: FetchPnL;
  defaultPeriod?: Period;
  title?: string;
  className?: string;
}

export function PnLWidget({
  fetchPnL,
  defaultPeriod = 30,
  title = 'P&L',
  className = '',
}: PnLWidgetProps) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [state, setState] = useState<WidgetState>('idle');
  const [data, setData] = useState<PnLData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (p: Period) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState('loading');
      setError(null);

      try {
        const result = await fetchPnL(p);
        if (abortRef.current.signal.aborted) return;
        if (result.points.length === 0) {
          setState('empty');
        } else {
          setData(result);
          setState('success');
        }
      } catch (err) {
        if (abortRef.current.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        setState('error');
      }
    },
    [fetchPnL]
  );

  useEffect(() => {
    load(period);
    return () => abortRef.current?.abort();
  }, [load, period]);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
  };

  const totals = data?.points.length ? aggregateTotals(data.points) : null;

  return (
    <section
      className={['rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-6 space-y-5', className].join(' ')}
      aria-label={`Виджет ${title}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
        <PeriodSwitcher
          value={period}
          onChange={handlePeriodChange}
          disabled={state === 'loading'}
        />
      </div>

      {state === 'loading' && <PnLSkeleton />}

      {state === 'error' && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Ошибка загрузки</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => load(period)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Повторить
          </button>
        </div>
      )}

      {state === 'empty' && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <TrendingUp className="w-10 h-10 text-muted-foreground/40" />
          <p className="font-medium text-foreground">Нет данных</p>
          <p className="text-sm text-muted-foreground">За выбранный период данные отсутствуют</p>
        </div>
      )}

      {state === 'success' && data && (
        <>
          {totals && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Выручка" value={formatCurrency(totals.revenue)} accent="blue" />
              <StatCard label="Себестоимость" value={formatCurrency(totals.cost + totals.commissions + totals.logistics)} accent="amber" />
              <StatCard label="Маржа" value={formatCurrency(totals.margin)} accent={totals.margin >= 0 ? 'green' : 'red'} />
              <StatCard label="Маржинальность" value={formatPercent(totals.marginPercent)} accent={totals.marginPercent >= 15 ? 'green' : 'amber'} />
            </div>
          )}

          <PnLChart data={data.points} />

          <PnLTable data={data.points} />
        </>
      )}
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  accent: 'blue' | 'amber' | 'green' | 'red';
}

const ACCENT_CLASSES: Record<StatCardProps['accent'], string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  amber: 'text-amber-600 dark:text-amber-400',
  green: 'text-green-600 dark:text-green-400',
  red: 'text-red-600 dark:text-red-400',
};

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={['text-base font-semibold tabular-nums', ACCENT_CLASSES[accent]].join(' ')}>{value}</p>
    </div>
  );
}
