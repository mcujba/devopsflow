import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { services, getServiceBySlug } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Unit } from "@/components/rack/unit";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceTools } from "@/components/services/service-tools";
import { RelatedServices } from "@/components/services/related-services";
import { CtaBand } from "@/components/sections/cta-band";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return services.flatMap((service) =>
    routing.locales.map((locale) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return pageMetadata({
    locale: locale as Locale,
    path: `/services/${slug}`,
    title: t(`${service.key}_title`),
    description: t(`${service.key}_desc`),
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const name = t(`${service.key}_title`);

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          locale: locale as Locale,
          slug,
          name,
          description: t(`${service.key}_desc`),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "DevOpsFlow", url: absoluteUrl(locale as Locale, "/") },
          { name, url: absoluteUrl(locale as Locale, `/services/${slug}`) },
        ])}
      />
      <Unit>
        <ServiceDetailHero slug={slug} />
        <ServiceFeatures slug={slug} />
        <ServiceTools slug={slug} />
      </Unit>
      <Unit>
        <RelatedServices currentSlug={slug} />
        <CtaBand />
      </Unit>
    </>
  );
}
