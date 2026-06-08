"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  actions: any[];
}

export function AIActionHandler({ actions }: Props) {
  const router = useRouter();

  useEffect(() => {
    actions.forEach((action) => {
      switch (action.type) {
        case "navigate":
          router.push(action.path);
          break;

        case "open_product":
          router.push(`/products/${action.productId}`);
          break;
      }
    });
  }, [actions, router]);

  return null;
}
