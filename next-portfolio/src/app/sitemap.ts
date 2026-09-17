import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.baseUrl,
      lastModified: new Date("2026-06-06"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
