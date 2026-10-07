import type { Locale } from "@/i18n/routing";

export const SITE_URL = "https://devopsflow.io";
export const SITE_NAME = "DevOpsFlow";
export const LEGAL_NAME = "Skynet Hosting SRL";
export const CONTACT_EMAIL = "info@skynet.hosting";
export const CONTACT_PHONE = "+37360332333";
export const CONTACT_PHONE_DISPLAY = "+373 60 332 333";

export const STATS = [
  { key: "experience", value: "10+" },
  { key: "requests", value: "10M+" },
  { key: "deploys", value: "60%" },
  { key: "uptime", value: "99.9%" },
] as const;

export const CERTIFICATIONS = [
  "CKA",
  "CCNP",
  "CCNA",
  "LPIC-1",
  "NSE-5",
  "NSE-4",
  "JNCIS-ENT",
  "JNCIA",
  "MTCNA",
  "MTCWE",
] as const;

export const NAV_LINKS = [
  { key: "services", href: "/#services" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/#contact" },
] as const;

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ro: "ro_RO",
  ru: "ru_RU",
};
