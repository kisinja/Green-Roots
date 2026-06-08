import { Product } from "@prisma/client";

export type AIAction =
  | {
      type: "navigate";
      path: string;
    }
  | {
      type: "open_product";
      productId: string;
    }
  | {
      type: "show_products";
      productIds: string[];
    };

export interface ProductRecommendation {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
}

export interface AIResponse {
  message: string;

  products: ProductRecommendation[];

  actions: AIAction[];

  followUpQuestions: string[];
}

export interface AIContext {
  pathname: string;

  currentProductId?: string;

  cartItems?: string[];

  user?: {
    id: string;
    location?: string;
    previousOrders?: string[];
  };
}

export interface RetrievalResult {
  products: any[];
  crops: any[];
  diseases: any[];
  blogs: any[];
}