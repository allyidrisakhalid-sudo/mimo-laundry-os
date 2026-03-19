import type { MetadataRoute } from "next";
import { SEO_HOST } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/track", "/partners", "/help", "/login", "/signup", "/terms", "/privacy", "/refund-policy"],
        disallow: ["/app/", "/customer/", "/driver/", "/hub/", "/affiliate/", "/admin/", "/dev/"],
      },
    ],
    sitemap: `${SEO_HOST}/sitemap.xml`,
    host: SEO_HOST,
  };
}
