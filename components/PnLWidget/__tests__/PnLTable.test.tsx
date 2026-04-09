import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PnLTable } from '../PnLTable';
import type { PnLDataPoint } from '../types';

afterEach(cleanup);

const mockData: PnLDataPoint[] = [
  {
    date: '2024-06-01',
    revenue: 100_000,
    cost: 40_000,
    commissions: 8_000,
    logistics: 5_000,
    margin: 47_000,
  },
  {
    date: '2024-06-02',
    revenue: 80_000,
    cost: 32_000,
    commissions: 6_500,
    logistics: 4_000,
    margin: 37_500,
  },
];

describe('PnLTable', () => {
  it('renders the table element', () => {
    render(<PnLTable data={mockData} />);
    expect(screen.getByRole('table')).toBeTruthy();
  });

  it('renders all column headers', () => {
    render(<PnLTable data={mockData} />);
    expect(screen.getByText('Дата')).toBeTruthy();
    expect(screen.getByText('Выручка')).toBeTruthy();
    expect(screen.getByText('Себестоимость')).toBeTruthy();
    expect(screen.getByText('Комиссии')).toBeTruthy();
    expect(screen.getByText('Маржа')).toBeTruthy();
    expect(screen.getByText('Маржинальность')).toBeTruthy();
  });

  it('renders correct number of rows', () => {
    render(<PnLTable data={mockData} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });

  it('renders correct number of rows for empty data', () => {
    render(<PnLTable data={[]} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('displays formatted dates', () => {
    render(<PnLTable data={mockData} />);
    const allCells = screen.getAllByRole('cell');
    const dateCells = allCells.filter((cell) =>
      cell.textContent?.match(/\d{2}\.\d{2}\.\d{4}/)
    );
    expect(dateCells).toHaveLength(mockData.length);
  });

  it('displays margin percent for first row', () => {
    render(<PnLTable data={mockData} />);
    expect(screen.getByText('47.0%')).toBeTruthy();
  });

  it('renders with single data point', () => {
    render(<PnLTable data={[mockData[0]]} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
  });
});
