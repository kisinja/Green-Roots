import {prisma} from "@/lib/prisma";

export async function searchDiseases(
  query: string
) {
  return prisma.diseaseGuide.findMany({
    where: {
      diseaseName: {
        contains: query,
        mode: "insensitive",
      },
    },
  });
}