import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, personJsonLd, professionalServiceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { CodeWindow } from "@/components/sections/code-window";
import { Proof } from "@/components/sections/proof";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
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

  return (
    <>
      <JsonLd data={personJsonLd(locale as Locale)} />
      <JsonLd data={professionalServiceJsonLd(locale as Locale, t("description"))} />
      <Hero />
      <div className="px-4 sm:px-6 lg:px-8">
        <CodeWindow />
      </div>
      <Proof />
      <Services />
      <AboutTeaser />
      <Process />
      <Contact />
    </>
  );
}
