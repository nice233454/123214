'use client';

import { Period } from './types';

interface PeriodSwitcherProps {
  value: Period;
  onChange: (period: Period) => void;
  disabled?: boolean;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: '7 дней', value: 7 },
  { label: '30 дней', value: 30 },
  { label: '90 дней', value: 90 },
];

export function PeriodSwitcher({ value, onChange, disabled }: PeriodSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Выбор периода"
      className="inline-flex rounded-lg border border-border bg-muted p-0.5 gap-0.5"
    >
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(p.value)}
          aria-pressed={value === p.value}
          className={[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === p.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
