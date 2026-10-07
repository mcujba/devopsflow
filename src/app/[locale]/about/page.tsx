import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import {
  AboutHero,
  AboutCompany,
  AboutFounder,
  AboutTimeline,
  AboutCertifications,
  AboutProcess,
  AboutValues,
  AboutCTA,
} from "@/components/about/about-sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return pageMetadata({
    locale: locale as Locale,
    path: "/about",
    title: t("meta_title"),
    description: t("hero_subtitle"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <AboutFounder />
      <AboutCertifications />
      <AboutProcess />
      <AboutTimeline />
      <AboutCompany />
      <AboutValues />
      <AboutCTA />
    </>
  );
}
