import type { AggregateSales, ProductSalesDetails } from '../types.js';

export const getMaxSoldProductPerDay = (
  aggregateData: AggregateSales,
): Record<string, ProductSalesDetails> => {
  const groupByDate = Object.values(aggregateData).reduce<
    Record<string, ProductSalesDetails[]>
  >((acc, record) => {
    const { salesDate } = record;

    if (!acc[salesDate]) {
      acc[salesDate] = [];
    }

    acc[salesDate].push(record);
    return acc;
  }, {});

  const maxPerDay = Object.entries(groupByDate).reduce<
    Record<string, ProductSalesDetails>
  >((acc, [date, records]) => {
    const max = records.sort((a, b) => {
      if (b.productSales !== a.productSales) {
        return b.productSales - a.productSales;
      }
      return a.productName.localeCompare(b.productName);
    })[0];

    acc[date] = {
      salesDate: max?.salesDate || '',
      productId: max?.productId || '',
      productName: max?.productName || '',
      productSales: max?.productSales || 0,
      orderIds: max?.orderIds || [],
      customerIds: max?.customerIds || [],
      totalSales: max?.totalSales || 0,
    };

    return acc;
  }, {});

  return maxPerDay;
};
