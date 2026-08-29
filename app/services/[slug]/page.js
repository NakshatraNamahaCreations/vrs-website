import { services, slugifyService } from "../services-data";
import ServiceDetail from "./ServiceDetail";

/**
 * With `output: "export"` we need every service slug pre-declared so Next
 * builds a static HTML file for each detail page at build time.
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: slugifyService(s.title) }));
}

export default function ServiceSlugPage() {
  return <ServiceDetail />;
}
