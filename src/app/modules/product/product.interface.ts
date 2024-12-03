import { Size } from "@prisma/client";

export interface IProduct {
  name: string;
  price: string; // Keeping it as a string since it appears as such in the data
  stock: string; // Also keeping as string unless it should be converted to number
  categoryId: string; // UUID for category
  shopId: string; // UUID for shop
  sizes: Size[]; // Array of size strings (e.g., ['L', 'M'])
  images: string[]; // Array of image URLs
  discounts: string;
  description: string;
}

export interface IUpdateProduct {
  name: string;
  price: number; // Keeping it as a string since it appears as such in the data
  stock: number; // Also keeping as string unless it should be converted to number
  sizes: Size[]; // Array of size strings (e.g., ['L', 'M'])
  images: string[]; // Array of image URLs
  discounts: number;
  description: string;
}
