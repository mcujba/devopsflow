import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import { getAllPosts } from "@/lib/blog";

function entriesFor(
  path: string,
  locales: readonly Locale[],
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = languageAlternates(path, { absolute: true, locales });
  return locales.map((locale) => ({
    url: absoluteUrl(locale, path),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about",
    "/blog",
    ...services.map((service) => `/services/${service.slug}`),
  ];

  const posts = new Map<string, { locales: Locale[]; date: string }>();
  for (const locale of routing.locales) {
    for (const { slug, frontmatter } of getAllPosts(locale)) {
      const known = posts.get(slug);
      posts.set(slug, {
        locales: [...(known?.locales ?? []), locale],
        date: known?.date ?? frontmatter.date,
      });
    }
  }

  return [
    ...staticPaths.flatMap((path) => entriesFor(path, routing.locales)),
    ...[...posts].flatMap(([slug, { locales, date }]) =>
      entriesFor(`/blog/${slug}`, locales, date),
    ),
  ];
}
