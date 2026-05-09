import fs from 'fs';
import type { Orders, Products, Result } from './types.js';
import { getAggregateData } from './utils/getAggregateData.js';
import { getMaxSoldProductPerDay } from './utils/getMaxSoldProductsPerDay.js';
import { getDateRangeProductResult } from './utils/getDateRangeProduct.js';

/**
 * 
 * @rules : 
 *  - Product sale should be conducted once per order (can have multiple entities in the order)
 *  - Cancelled orders should be credited against the product total (can have multiple entities in the order)
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
  /** 
   * @aggregateData :
   * {'P1-21/04/2026': {
        orderIds: [ 'O10', 'O20', 'O31' ],
        customerIds: [ 'C1', 'C2', 'C3' ],
        salesDate: '21/04/2026',
        productId: 'P1',
        productName: 'Ezy Storage 37L Flexi Laundry Basket - White',
        totalSales: 4,
        productSales: 3
  },}
   */
  const aggregateData = getAggregateData(ordersData, productMap);


// INFO: Finding the top-selling product for each day
/**
 * @maxSoldProductsPerDay :
 * '21/04/2026': {
        salesDate: '21/04/2026',
        productId: 'P1',
        productName: 'Ezy Storage 37L Flexi Laundry Basket - White',
        productSales: 3,
        orderIds: [ 'O10', 'O20', 'O31' ],
        customerIds: [ 'C1', 'C2', 'C3' ],
        totalSales: 4
  },
 */
  const maxSoldProductsPerDay = getMaxSoldProductPerDay(aggregateData);

  // INFO: Creating a data structure to store the top-selling product for each day
  /**
   * @productPerDay :
    * [{
        date: '21/04/2026',
        productName: 'Ezy Storage 37L Flexi Laundry Basket - White'
    }]
   */
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
