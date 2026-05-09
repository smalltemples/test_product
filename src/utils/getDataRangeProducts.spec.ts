import type { Result } from '../types.js';
import { getDateRangeProductResult } from './getDateRangeProduct.js';

describe('getDateRangeProduct', () => {
  it('appends a summary row with the mostly sold product and date range from first to last row', () => {
    const rows: Result[] = [
      { date: '2024-01-21', productName: 'Bucket' },
      { date: '2024-01-22', productName: 'Bricks' },
      { date: '2024-01-23', productName: 'Bricks' },
    ];

    expect(getDateRangeProductResult(rows)).toEqual([
      ...rows,
      { date: '2024-01-21 - 2024-01-23', productName: 'Bricks' },
    ]);
  });

  it('should return product name alpha betically sorted when product sales are equal', () => {
    const rows: Result[] = [
      { date: '2024-01-21', productName: 'Screws' },
      { date: '2024-01-22', productName: 'Zink bolts' },
      { date: '2024-01-23', productName: 'Nuts' },
    ];

    expect(getDateRangeProductResult(rows)).toEqual([
      ...rows,
      { date: '2024-01-21 - 2024-01-23', productName: 'Nuts' },
    ]);
  });
});
