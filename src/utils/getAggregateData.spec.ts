import type { Order } from '../types.js';
import { getAggregateData } from './getAggregateData.js';

describe('getAggregateData', () => {
  it('returns aggregate data for a single order', () => {
    const orders: Order[] = [
      {
        orderId: 'order1',
        customerId: 'c1',
        date: '2024-01-01',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 3 }],
      },
    ];
    const productMap: Record<string, string> = { p1: 'Widget' };

    const result = getAggregateData(orders, productMap);

    expect(result).toEqual({
      'p1-2024-01-01': {
        orderIds: ['order1'],
        customerIds: ['c1'],
        salesDate: '2024-01-01',
        productId: 'p1',
        productName: 'Widget',
        totalSales: 3,
        productSales: 1,
      },
    });
  });

  it('should not increament product sales when same customer buys same product on same day', () => {
    const orders: Order[] = [
      {
        orderId: 'order1',
        customerId: 'c1',
        date: '2024-01-02',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 2 }],
      },
      {
        orderId: 'order2',
        customerId: 'c1',
        date: '2024-01-02',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 4 }],
      },
    ];
    const productMap = { p1: 'Widget' };

    const result = getAggregateData(orders, productMap);
    const key = 'p1-2024-01-02';

    expect(result[key]).toMatchObject({
      orderIds: expect.arrayContaining(['order1', 'order2']),
      customerIds: ['c1'],
      totalSales: 6,
      productSales: 1,
    });
  });

  it('should increments productSales when a new customer buys the same product on the same day in different orders', () => {
    const orders: Order[] = [
      {
        orderId: 'order1',
        customerId: 'c1',
        date: '2024-01-03',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 1 }],
      },
      {
        orderId: 'order2',
        customerId: 'c2',
        date: '2024-01-03',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 2 }],
      },
    ];
    const productMap = { p1: 'Widget' };

    const result = getAggregateData(orders, productMap);
    const key = 'p1-2024-01-03';

    expect(result[key]).toMatchObject({
      totalSales: 3,
      productSales: 2,
      customerIds: expect.arrayContaining(['c1', 'c2']),
    });
  });

  it('should decrement product sales when order is cancelled', () => {
    const orders: Order[] = [
      {
        orderId: 'order1',
        customerId: 'c1',
        date: '2024-01-04',
        status: 'completed',
        entries: [{ id: 'p1', quantity: 1 }],
      },
      {
        orderId: 'order1',
        date: '2024-01-05',
        status: 'cancelled',
      },
    ];
    const productMap = { p1: 'Widget' };

    const result = getAggregateData(orders, productMap);
    const key = 'p1-2024-01-04';

    expect(result).toEqual({});
  });
});
