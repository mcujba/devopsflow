import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CERTIFICATIONS,
  OG_LOCALES,
} from "@/lib/site";

const PERSON_ID = `${SITE_URL}/#person`;
const BUSINESS_ID = `${SITE_URL}/#business`;

export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  const localized = localePath(locale, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

interface AlternateOptions {
  absolute?: boolean;
  locales?: readonly Locale[];
}

export function languageAlternates(
  path: string,
  { absolute = false, locales = routing.locales }: AlternateOptions = {},
): Record<string, string> {
  const build = absolute ? absoluteUrl : localePath;
  const alternates: Record<string, string> = {};
  for (const locale of locales) alternates[locale] = build(locale, path);
  if (locales.includes(routing.defaultLocale)) {
    alternates["x-default"] = build(routing.defaultLocale, path);
  }
  return alternates;
}

interface PageMetadataInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  locales?: readonly Locale[];
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  locales,
}: PageMetadataInput): Metadata {
  const url = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path, { locales }),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Maxim Cujba",
    jobTitle: "Senior DevOps Engineer",
    url: absoluteUrl(locale, "/about"),
    worksFor: { "@type": "Organization", name: LEGAL_NAME },
    knowsAbout: ["Kubernetes", "CI/CD", "Terraform", "AWS", "Linux", "Network engineering"],
    hasCredential: CERTIFICATIONS.map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
    })),
  };
}

export function professionalServiceJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: absoluteUrl(locale, "/"),
    description,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chișinău",
      addressCountry: "MD",
    },
    founder: { "@id": PERSON_ID },
  };
}

interface ServiceInput {
  locale: Locale;
  slug: string;
  name: string;
  description: string;
}

export function serviceJsonLd({ locale, slug, name, description }: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl(locale, `/services/${slug}`),
    provider: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface BlogPostingInput {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

export function blogPostingJsonLd({
  locale,
  slug,
  title,
  description,
  date,
  author,
}: BlogPostingInput) {
  const url = absoluteUrl(locale, `/blog/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: author },
    publisher: { "@id": BUSINESS_ID },
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
