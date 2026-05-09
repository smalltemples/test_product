
export type OrderEntry = {
  id: string;
  quantity: number;
};

export type Order = {
  orderId: string;
  customerId?: string;
  entries?: OrderEntry[];
  date: string;
  status: 'completed' | 'cancelled';
};

export type Product = {
  id: string;
  name: string;
};

export type ProductSalesDetails = {
  orderIds: string[];
  customerIds: string[];
  salesDate: string;
  productId: string;
  productName: string;
  totalSales: number;
  productSales: number;
};

// This data structure to find unique products sold on each day
// key is productId-salesDate
export type AggregateSales = Record<string, ProductSalesDetails>;

export type Result = {
    date: string;
    productName: string;
  };

export type Orders = Order[];
export type Products = Product[];
