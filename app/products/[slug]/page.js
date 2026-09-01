import { products as fallbackProducts, slugify } from "../data";
import ProductDetails from "./ProductDetails";

const API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5000";

/**
 * With `output: "export"` every dynamic slug has to be enumerated at build
 * time — Next generates one static HTML file per entry returned here. We
 * union the live product list from the backend with the bundled static
 * catalogue so:
 *   - Products created via the admin panel get a page as soon as we rebuild.
 *   - If the API is unreachable during the build, we still emit pages for
 *     the static fallback list (no broken links for the pre-existing set).
 *
 * Runs on the build server, not in the browser. `cache: "no-store"` keeps
 * subsequent builds from serving a stale list out of Next's fetch cache.
 */
export async function generateStaticParams() {
  const staticSlugs = fallbackProducts.map((p) => ({ slug: slugify(p.name) }));

  try {
    const res = await fetch(`${API_URL}/api/products?limit=500`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    const apiSlugs = (data.items || [])
      .map((p) => p?.name)
      .filter(Boolean)
      .map((name) => ({ slug: slugify(name) }));

    // Union — API wins for duplicates; static entries fill any gaps.
    const seen = new Set();
    return [...apiSlugs, ...staticSlugs].filter(({ slug }) => {
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  } catch (err) {
    console.warn(
      `[products/[slug]] generateStaticParams: fetch failed (${err.message}); ` +
      `falling back to static data.js.`
    );
    return staticSlugs;
  }
}

export default function ProductDetailsPage() {
  return <ProductDetails />;
}
