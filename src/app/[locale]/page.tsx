import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, personJsonLd, professionalServiceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { getAllPosts } from "@/lib/blog";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { BlogTray } from "@/components/sections/blog-tray";
import { Contact } from "@/components/sections/contact";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const meta = pageMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });

  return { ...meta, title: { absolute: t("title") } };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const posts = getAllPosts(locale as Locale).slice(0, 3);

  return (
    <>
      <JsonLd data={personJsonLd(locale as Locale)} />
      <JsonLd data={professionalServiceJsonLd(locale as Locale, t("description"))} />
      <Hero />
      <Services />
      <AboutTeaser />
      <Process />
      <BlogTray posts={posts} />
      <Contact />
    </>
  );
}
