import { setRequestLocale } from "next-intl/server";
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
