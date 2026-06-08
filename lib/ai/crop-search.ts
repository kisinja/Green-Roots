import {prisma} from "@/lib/prisma";

export async function searchCropGuides(
  query: string
) {
  return prisma.cropGuide.findMany({
    where: {
      cropName: {
        contains: query,
        mode: "insensitive",
      },
    },
  });
}