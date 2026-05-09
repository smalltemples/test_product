import type { AggregateSales, Order } from '../types.js';

// TODO: This function is complex, we can break down to smaller functions for more readability
export const getAggregateData = (
  ordersData: Order[],
  productMap: Record<string, string>,
) => {
  const aggregateData: AggregateSales = {};
  ordersData.forEach((order) => {
    order.entries?.forEach((entry) => {
      const keyId = `${entry.id}-${order.date}`; // productId-salesDate - unique Id
      const productData = aggregateData[keyId];
      if (!productData) {
        aggregateData[keyId] = {
          orderIds: [order.orderId],
          customerIds: order.customerId ? [order.customerId] : [],
          salesDate: order.date,
          productId: entry.id,
          productName: productMap[entry.id] || 'Product not found',
          totalSales: entry.quantity,
          productSales: 1,
        };
      } else if (
        productData &&
        order.customerId &&
        order.status === 'completed' &&
        productData.customerIds.includes(order.customerId)
      ) {
        if (!productData.orderIds.includes(order.orderId)) {
          productData.orderIds.push(order.orderId);
        }
        productData.totalSales += entry.quantity;
      } else if (
        productData &&
        order.customerId &&
        order.status === 'completed' &&
        !productData.customerIds.includes(order.customerId)
      ) {
        if (!productData.orderIds.includes(order.orderId)) {
          productData.orderIds.push(order.orderId);
        }
        productData.customerIds.push(order.customerId);
        productData.totalSales += entry.quantity;
        productData.productSales += 1;
      }
    });
    if (order.status === 'cancelled') {
      const orderDetails = ordersData.find((o) => o.orderId === order.orderId);
      if (!orderDetails) {
        console.log(`Order ${order.orderId} not found`);
        return;
      }
      orderDetails.entries?.forEach((entry) => {
        const keyId = `${entry.id}-${orderDetails.date}`;
        const oldOrderData = aggregateData[keyId];
        if (!oldOrderData) {
          console.log(
            `Product ${entry.id} not found in previous order ${orderDetails.orderId}`,
          );
          return;
        } else {
          oldOrderData.totalSales -= entry.quantity;
          oldOrderData.productSales -= 1;
          if (oldOrderData.totalSales === 0) {
            delete aggregateData[keyId];
            return;
          }
          oldOrderData.orderIds = oldOrderData.orderIds.filter(
            (id) => id !== orderDetails.orderId,
          );
          oldOrderData.customerIds = oldOrderData.customerIds.filter(
            (id) => id !== orderDetails.customerId,
          );
          aggregateData[keyId] = oldOrderData;
        }
      });
    }
  });

  return aggregateData;
};
