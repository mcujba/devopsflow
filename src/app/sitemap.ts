import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import { getAllPostSlugs } from "@/lib/blog";

function entriesFor(path: string, locales: readonly Locale[]): MetadataRoute.Sitemap {
  const languages = languageAlternates(path, { absolute: true, locales });
  return locales.map((locale) => ({
    url: absoluteUrl(locale, path),
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

  const localesBySlug = new Map<string, Locale[]>();
  for (const locale of routing.locales) {
    for (const slug of getAllPostSlugs(locale)) {
      localesBySlug.set(slug, [...(localesBySlug.get(slug) ?? []), locale]);
    }
  }

  return [
    ...staticPaths.flatMap((path) => entriesFor(path, routing.locales)),
    ...[...localesBySlug].flatMap(([slug, locales]) => entriesFor(`/blog/${slug}`, locales)),
  ];
}
