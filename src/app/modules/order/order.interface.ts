export interface IOrderItem {
  productId: string; // Product ID
  size?: string; // Optional size of the product
  quantity: number; // Quantity of the product
  price: number; // Price of the product at the time of order
  discount: number; // Discount applied to this item
  shopId: string;
}

// Interface for the entire order
export interface IOrderRequest {
  items: IOrderItem[]; // List of items in the order
  total: number; // Total price before discounts
  discounts: number; // Total discounts applied to the order
  subTotal: number; // Final total after discounts
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED"; // Optional payment status
}
