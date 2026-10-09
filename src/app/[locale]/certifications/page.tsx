import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { CertificationsHeader } from "@/components/certifications/certifications-header";
import { CertificationList } from "@/components/certifications/certification-list";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Certifications" });

  return pageMetadata({
    locale: locale as Locale,
    path: "/certifications",
    title: t("meta_title"),
    description: t("intro"),
  });
}

export default async function CertificationsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CertificationsHeader />
      <CertificationList />
    </>
  );
}
