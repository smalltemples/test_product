import fs from 'fs';
import type { Orders, Products, Result } from './types.js';
import { getAggregateData } from './utils/getAggregateData.js';
import { getMaxSoldProductPerDay } from './utils/getMaxSoldProductsPerDay.js';
import { getDateRangeProductResult } from './utils/getDateRangeProduct.js';

/**
 * 
 * @rules : 
 *  - Product sale should be conducted once per order (can have multiple entities in the order)
 *  - Cancelled orders should be credited against the product total
 *  - In the case of product sales being equal for two or more products, sort the products alphabetically and select the first one in the list
 * @input : orders.json and products.json - specific details for order data and product data
 * @output : datae or date range with top sizzling hot product
 */

export const calculateOrders = (): Result[] => {
  const orders = fs.readFileSync('inputs/orders.json', 'utf8');
  const products = fs.readFileSync('inputs/products.json', 'utf8');

  // TODO: Assuming data is correct in input files (no validation)
  const ordersData: Orders = JSON.parse(orders);
  const productsData: Products = JSON.parse(products);

  //INFO: Generating a product map so we can search by product Id
  const productMap = productsData.reduce<Record<string, string>>(
    (acc, product) => {
      acc[product.id] = product.name;
      return acc;
    },
    {},
  );

  // INFO: Creating data structure to aggregate sales data by productId and salesDate
  const aggregateData = getAggregateData(ordersData, productMap);


// INFO: Finding the top-selling product for each day
  const maxSoldProductsPerDay = getMaxSoldProductPerDay(aggregateData);

  // INFO: Creating a data structure to store the top-selling product for each day
  const productPerDay = Object.entries(maxSoldProductsPerDay).map(
    ([date, product]) => ({
      date,
      productName: product.productName,
    }),
  );

  // INFO: Generating results in the required format with date range and product name
  const results = getDateRangeProductResult(productPerDay);
  return results;
};
