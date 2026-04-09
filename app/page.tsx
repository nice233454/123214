'use client';

import { useState } from 'react';
import { PnLWidget, mockFetchPnL, mockFetchPnLEmpty, mockFetchPnLError } from '@/components/PnLWidget';

type Scenario = 'default' | 'empty' | 'error';

const SCENARIOS: { label: string; value: Scenario }[] = [
  { label: 'Данные', value: 'default' },
  { label: 'Пустые данные', value: 'empty' },
  { label: 'Ошибка', value: 'error' },
];

export default function Home() {
  const [scenario, setScenario] = useState<Scenario>('default');

  const loader =
    scenario === 'empty'
      ? mockFetchPnLEmpty
      : scenario === 'error'
      ? mockFetchPnLError
      : mockFetchPnL;

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">PnLWidget</h1>
          <p className="text-sm text-muted-foreground">
            Переиспользуемый компонент для визуализации прибылей и убытков по дням
          </p>
        </header>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">Сценарий:</span>
          <div className="inline-flex rounded-lg border border-border bg-muted p-0.5 gap-0.5">
            {SCENARIOS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setScenario(s.value)}
                aria-pressed={scenario === s.value}
                className={[
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
                  scenario === s.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <PnLWidget
          key={scenario}
          fetchPnL={loader}
          defaultPeriod={30}
          title="Прибыли и убытки"
        />
      </div>
    </main>
  );
}
