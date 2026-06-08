import { searchProducts } from "./product-search";
import { searchCropGuides } from "./crop-search";
import { searchDiseases } from "./disease-search";
import { searchBlogs } from "./blog-search";

export async function retrieveKnowledge(
  query: string
) {
  const [
    products,
    crops,
    diseases,
    blogs,
  ] = await Promise.all([
    searchProducts(query),
    searchCropGuides(query),
    searchDiseases(query),
    searchBlogs(query),
  ]);

  return {
    products,
    crops,
    diseases,
    blogs,
  };
}