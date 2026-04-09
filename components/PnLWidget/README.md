# PnLWidget

Переиспользуемый React-компонент для дашборда с визуализацией прибылей и убытков (P&L) по дням.

## Структура папки

```
components/PnLWidget/
├── index.ts            — публичные экспорты
├── types.ts            — TypeScript-типы
├── utils.ts            — форматирование и вычисления
├── mockLoader.ts       — mock-загрузчики данных
├── PnLWidget.tsx       — основной компонент
├── PnLChart.tsx        — stacked bar chart (Recharts)
├── PnLTable.tsx        — таблица данных
├── PeriodSwitcher.tsx  — переключатель периода
├── PnLSkeleton.tsx     — skeleton-заглушка при загрузке
└── __tests__/
    ├── formatters.test.ts  — тесты утилит форматирования
    └── PnLTable.test.tsx   — тесты рендера таблицы
```

## Использование

```tsx
import { PnLWidget, mockFetchPnL } from '@/components/PnLWidget';

export default function Dashboard() {
  return (
    <PnLWidget
      fetchPnL={mockFetchPnL}
      defaultPeriod={30}
      title="P&L"
    />
  );
}
```

## Props

| Prop            | Тип         | По умолчанию | Описание                                        |
|-----------------|-------------|--------------|------------------------------------------------|
| `fetchPnL`      | `FetchPnL`  | —            | Async-функция загрузки данных (обязательный)    |
| `defaultPeriod` | `7 \| 30 \| 90` | `30`    | Начальный период отображения                    |
| `title`         | `string`    | `'P&L'`      | Заголовок виджета                               |
| `className`     | `string`    | `''`         | Дополнительные CSS-классы для контейнера        |

## Тип FetchPnL

```ts
type FetchPnL = (period: Period) => Promise<PnLData>;

type Period = 7 | 30 | 90;

interface PnLData {
  period: Period;
  points: PnLDataPoint[];
}

interface PnLDataPoint {
  date: string;       // ISO 8601: "2024-01-15"
  revenue: number;    // Выручка, руб.
  cost: number;       // Себестоимость, руб.
  commissions: number;// Комиссии, руб.
  logistics: number;  // Логистика, руб.
  margin: number;     // Маржа = revenue - cost - commissions - logistics
}
```

## Mock-загрузчики

```ts
import {
  mockFetchPnL,       // Нормальные данные с задержкой 800 мс
  mockFetchPnLEmpty,  // Пустой массив (состояние empty)
  mockFetchPnLError,  // Выбрасывает ошибку (состояние error)
} from '@/components/PnLWidget';
```

## Состояния компонента

| Состояние  | Описание                                           |
|------------|---------------------------------------------------|
| `loading`  | Skeleton-анимация при загрузке данных             |
| `success`  | Карточки-сводки, график и таблица                 |
| `empty`    | Иконка и сообщение об отсутствии данных           |
| `error`    | Сообщение об ошибке с кнопкой «Повторить»         |

## График

Recharts `ComposedChart`:
- **Bars (без stackId):** Выручка — синий
- **Bars (stackId="costs"):** Себестоимость (янтарный), Комиссии (зелёный), Логистика (оранжевый)
- **Line:** Маржа — зелёная линия с точками

## Запуск тестов

```bash
npm test        # одиночный запуск (vitest run)
npm run test:watch  # режим watch
```

## Зависимости

- Next.js 14 (App Router)
- React 18
- TypeScript strict
- Tailwind CSS
- Recharts ^2.12
- Vitest ^2 + @testing-library/react + jsdom
