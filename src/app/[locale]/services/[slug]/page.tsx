import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { services, getServiceBySlug } from "@/lib/services";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceTools } from "@/components/services/service-tools";
import { RelatedServices } from "@/components/services/related-services";
import { ServicesCTA } from "@/components/sections/services-cta";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return services.flatMap((service) =>
    routing.locales.map((locale) => ({
      locale,
      slug: service.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return {
    title: t(`${service.key}_title`),
    description: t(`${service.key}_desc`),
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  setRequestLocale(locale);

  return (
    <>
      <ServiceDetailHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServiceTools slug={slug} />
      <RelatedServices currentSlug={slug} />
      <ServicesCTA />
    </>
  );
}
