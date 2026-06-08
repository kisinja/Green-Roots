"use client";

import { AIProductCard } from "./ai-product-card";

interface MessageProps {
  role: "user" | "assistant";

  content: string;

  products?: any[];
}

export function AIMessage({ role, content, products }: MessageProps) {
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-3xl rounded-2xl p-4 ${
          role === "user" ? "bg-green-700 text-white" : "bg-white border"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {products && products.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <AIProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
