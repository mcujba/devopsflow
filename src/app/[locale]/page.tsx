import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { StatsSection } from "@/components/sections/stats";
import { CertificationsSection } from "@/components/sections/certifications";
import { ProcessSection } from "@/components/sections/process";
import { CTASection } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <StatsSection />
      <ProcessSection />
      <CertificationsSection />
      <CTASection />
    </>
  );
}
