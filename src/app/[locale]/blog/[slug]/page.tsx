import type { Metadata } from "next";
import { blogPostingJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Unit } from "@/components/rack/unit";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale as Locale);
  if (!post) return {};

  return pageMetadata({
    locale: locale as Locale,
    path: `/blog/${slug}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    publishedTime: post.frontmatter.date,
    locales: routing.locales.filter((l) => getAllPostSlugs(l).includes(slug)),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const post = await getPostBySlug(slug, locale as Locale);

  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          locale: locale as Locale,
          slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          date: post.frontmatter.date,
        })}
      />
      <Unit>
        <Link href="/blog" className="engraved inline-flex min-h-11 items-center hover:text-ink">
          ← {t("back_to_blog")}
        </Link>
        <h1 className="display mt-2 max-w-3xl text-3xl leading-tight sm:text-4xl">
          {post.frontmatter.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-ink-muted">
          {t("published")}{" "}
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>{" "}
          · {post.readingTime} {t("min_read")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("tags_label")}>
          {post.frontmatter.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </Unit>

      <article className="sheet prose prose-lg mx-auto w-full max-w-[72ch] px-5 py-8 sm:px-10">
        <p className="lead">{post.frontmatter.description}</p>
        {post.content}
      </article>
    </>
  );
}
