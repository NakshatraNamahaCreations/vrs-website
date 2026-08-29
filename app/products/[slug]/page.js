import { products, slugify } from "../data";
import ProductDetails from "./ProductDetails";

export function generateStaticParams() {
  return products.map((p) => ({ slug: slugify(p.name) }));
}

export default function ProductDetailsPage() {
  return <ProductDetails />;
}
