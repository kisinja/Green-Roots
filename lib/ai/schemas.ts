import { z } from "zod";

export const AIActionSchema = z.union([
  z.object({
    type: z.literal("navigate"),
    path: z.string(),
  }),

  z.object({
    type: z.literal("open_product"),
    productId: z.string(),
  }),

  z.object({
    type: z.literal("show_products"),
    productIds: z.array(z.string()),
  }),
]);

export const AIResponseSchema = z.object({
  message: z.string(),

  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      price: z.number(),
      image: z.string().optional(),
      stock: z.number(),
      averageRating: z.number(),
      reviewCount: z.number(),
    })
  ),

  actions: z.array(AIActionSchema),

  followUpQuestions: z.array(z.string()),
});

export type ParsedAIResponse = z.infer<
  typeof AIResponseSchema
>;