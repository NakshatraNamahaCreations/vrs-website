import { categories, slugify } from "../../products/data";
import CategoryPage from "./CategoryPage";

/**
 * With `output: "export"` we need every dynamic path pre-declared so Next
 * can generate a static HTML file per category at build time.
 */
export function generateStaticParams() {
  return categories.map((c) => ({ slug: slugify(c) }));
}

export default function CategorySlugPage() {
  return <CategoryPage />;
}
