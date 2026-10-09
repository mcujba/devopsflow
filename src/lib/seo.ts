import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LINKEDIN_URL,
  CREDLY_URL,
  OG_LOCALES,
} from "@/lib/site";
import { ISSUERS, currentCertifications } from "@/lib/certifications";

const PERSON_ID = `${SITE_URL}/#person`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const BUSINESS_REF = { "@id": BUSINESS_ID, name: SITE_NAME, url: SITE_URL };
const FOUNDER_NAME = "Maxim Cujba";

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

const MAX_DESCRIPTION = 160;
/** The layout appends " | DevOpsFlow" (13 characters) to page titles. */
const MAX_TITLE_WITH_SUFFIX = 57;

/** Cut at a word boundary: search results truncate longer descriptions mid-word. */
function clampDescription(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  const cut = text.slice(0, MAX_DESCRIPTION - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "")}…`;
}

interface PageMetadataInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  locales?: readonly Locale[];
  /** Set for blog posts: switches Open Graph to `article`. */
  publishedTime?: string;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  locales,
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = localePath(locale, path);
  description = clampDescription(description);
  // Page-level openGraph replaces the layout's, so the file-based image must be repeated here.
  const images = [
    { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: SITE_NAME },
  ];
  return {
    // A long title drops the site suffix rather than overflow the result line.
    title: title.length > MAX_TITLE_WITH_SUFFIX ? { absolute: title } : title,
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
      ...(publishedTime ? { type: "article" as const, publishedTime } : { type: "website" as const }),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function personJsonLd(locale: Locale, now: Date = new Date()) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: FOUNDER_NAME,
    image: `${SITE_URL}/maxim-cujba.jpg`,
    jobTitle: "Senior DevOps Engineer",
    url: absoluteUrl(locale, "/about"),
    worksFor: { "@type": "Organization", name: LEGAL_NAME },
    knowsAbout: ["Kubernetes", "CI/CD", "Terraform", "AWS", "Linux", "Network engineering"],
    sameAs: [LINKEDIN_URL, CREDLY_URL],
    // Expired credentials stay on the certifications page; structured data lists valid ones only.
    hasCredential: currentCertifications(now).map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: ISSUERS[cert.issuer] },
      ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}),
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
    provider: BUSINESS_REF,
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
}

export function blogPostingJsonLd({
  locale,
  slug,
  title,
  description,
  date,
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
    author: { "@type": "Person", "@id": PERSON_ID, name: FOUNDER_NAME },
    publisher: BUSINESS_REF,
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
