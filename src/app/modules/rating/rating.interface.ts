export interface IReview {
  comment: string;
  rating: number; // Assuming the rating is a numerical value (e.g., 1-5)
  orderItemId: string; // Unique identifier for the order item
  productId: string; // Unique identifier for the product
}
