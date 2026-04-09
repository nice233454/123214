'use client';

export function PnLSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Загрузка данных" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded-md bg-muted" />
        <div className="h-9 w-52 rounded-lg bg-muted" />
      </div>

      <div className="h-[280px] w-full rounded-xl bg-muted" />

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="h-10 bg-muted/50" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-t border-border">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
