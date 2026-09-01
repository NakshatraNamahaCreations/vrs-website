import { categories as fallbackCategories, slugify } from "../../products/data";
import CategoryPage from "./CategoryPage";

const API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5000";

/**
 * With `output: "export"` we need every dynamic path pre-declared so Next
 * can generate a static HTML file per category at build time. We derive the
 * live category list from the product catalogue on the backend and union it
 * with the bundled static list so:
 *   - Categories created via the admin (as new products) get a landing page.
 *   - If the API is offline at build time we still ship pages for the known
 *     static categories.
 */
export async function generateStaticParams() {
  const staticSlugs = fallbackCategories.map((c) => ({ slug: slugify(c) }));

  try {
    const res = await fetch(`${API_URL}/api/products?limit=500`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    const uniqueCategories = new Set();
    (data.items || []).forEach((p) => p?.category && uniqueCategories.add(p.category));
    const apiSlugs = Array.from(uniqueCategories).map((c) => ({ slug: slugify(c) }));

    const seen = new Set();
    return [...apiSlugs, ...staticSlugs].filter(({ slug }) => {
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  } catch (err) {
    console.warn(
      `[categories/[slug]] generateStaticParams: fetch failed (${err.message}); ` +
      `falling back to static category list.`
    );
    return staticSlugs;
  }
}

export default function CategorySlugPage() {
  return <CategoryPage />;
}
