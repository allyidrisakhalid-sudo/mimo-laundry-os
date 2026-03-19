import type { MetadataRoute } from "next";
import { SEO_INDEXABLE_ROUTES, SEO_HOST } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SEO_INDEXABLE_ROUTES.map((path) => ({
    url: path === "/" ? `${SEO_HOST}/` : `${SEO_HOST}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
