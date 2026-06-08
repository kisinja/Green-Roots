import {prisma} from "@/lib/prisma";

export async function searchProducts(
  query: string
) {
  return prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          longDescription: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    include: {
      category: true,
      reviews: true,
    },

    take: 8,
  });
}