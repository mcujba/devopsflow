import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import { BlogListingSection } from "@/components/blog/blog-listing-section";
import type { Locale } from "@/i18n/routing";
import { Unit } from "@/components/rack/unit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return pageMetadata({
    locale: locale as Locale,
    path: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = getAllPosts(locale as Locale);

  return (
    <Unit>
      <p className="label-red">{t("label")}</p>
      <h1 className="display mt-1 text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="relief mt-3 max-w-2xl text-lg text-ink-muted">{t("subtitle")}</p>
      <div className="mt-6">
        <BlogListingSection posts={posts} />
      </div>
    </Unit>
  );
}
