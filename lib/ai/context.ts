import { AIContext } from "./types";

interface BuildContextInput {
  pathname: string;

  currentProductId?: string;

  cartItems?: string[];

  user?: {
    id: string;
    location?: string;
    previousOrders?: string[];
  };
}

export async function buildContext(
  input: BuildContextInput
): Promise<AIContext> {
  return {
    pathname: input.pathname,

    currentProductId:
      input.currentProductId,

    cartItems:
      input.cartItems ?? [],

    user: input.user,
  };
}