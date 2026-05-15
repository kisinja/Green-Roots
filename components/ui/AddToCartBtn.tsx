// components/ui/AddToCartBtn.tsx

"use client";

import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

interface Props {
  product: Product;
  quantity: number;
}

const AddToCartBtn = ({ product, quantity }: Props) => {
  const { addItem, updateQty, openCart, items } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      updateQty(product.id, existing.quantity + quantity);
    } else {
      addItem(product);

      if (quantity > 1) {
        updateQty(product.id, quantity);
      }
    }

    setAdded(true);
    openCart();

    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex h-14 items-center justify-center gap-3 rounded-2xl px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${
        added
          ? "bg-emerald-600"
          : "bg-[var(--green-700)] hover:bg-[var(--green-800)]"
      }`}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartBtn;
