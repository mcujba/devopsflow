import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
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
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale as Locale);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
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
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back_to_blog")}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.frontmatter.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {t("published")}{" "}
            {new Date(post.frontmatter.date).toLocaleDateString(
              locale === "ro" ? "ro-RO" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readingTime} {t("min_read")}
          </span>
        </div>

        <p className="mt-4 text-lg text-muted-foreground">
          {post.frontmatter.description}
        </p>
      </header>

      <hr className="my-8 border-border" />

      <article className="prose prose-lg max-w-none dark:prose-invert">
        {post.content}
      </article>
    </div>
  );
}
