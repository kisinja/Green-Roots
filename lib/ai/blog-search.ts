import {prisma} from "@/lib/prisma";

export async function searchBlogs(
  query: string
) {
  return prisma.blogPost.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    take: 5,
  });
}