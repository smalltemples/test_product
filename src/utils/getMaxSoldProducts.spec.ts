import type { AggregateSales } from '../types.js';
import { getMaxSoldProductPerDay } from './getMaxSoldProductsPerDay.js';

describe('getMaxSoldProductPerDay', () => {
  it('returns the top-selling product for each day', () => {
    const aggregate: AggregateSales = {
      'P1-2024-06-01': {
        orderIds: ['ORD-91002', 'ORD-91018'],
        customerIds: ['cust-m441', 'cust-k882'],
        salesDate: '2024-06-01',
        productId: 'P1',
        productName: 'Desk Lamp',
        totalSales: 24,
        productSales: 8,
      },
      'P2-2024-06-01': {
        orderIds: ['ORD-91007'],
        customerIds: ['cust-m441'],
        salesDate: '2024-06-01',
        productId: 'P2',
        productName: 'Notebook',
        totalSales: 14,
        productSales: 12,
      },
      'P3-2024-06-02': {
        orderIds: ['ORD-91031'],
        customerIds: ['cust-j019'],
        salesDate: '2024-06-02',
        productId: 'P3',
        productName: 'Wireless Mouse',
        totalSales: 56,
        productSales: 15,
      },
    };

    expect(getMaxSoldProductPerDay(aggregate)).toEqual({
      '2024-06-01': aggregate['P2-2024-06-01'],
      '2024-06-02': aggregate['P3-2024-06-02'],
    });
  });

  it('when two products with same sales on same day, picks the alphabetically first name', () => {
    const aggregate: AggregateSales = {
      'BBQ-2024-07-04': {
        orderIds: ['ORD-92001'],
        customerIds: ['cust-x001'],
        salesDate: '2024-07-04',
        productId: 'BBQ',
        productName: 'Coffee Mug',
        totalSales: 22,
        productSales: 6,
      },
      'Hammer-2024-07-04': {
        orderIds: ['ORD-92002'],
        customerIds: ['cust-x002'],
        salesDate: '2024-07-04',
        productId: 'Hammer',
        productName: 'Ballpoint Pen',
        totalSales: 18,
        productSales: 6,
      },
    };

    expect(getMaxSoldProductPerDay(aggregate)).toEqual({
      '2024-07-04': aggregate['Hammer-2024-07-04'],
    });
  });
});
