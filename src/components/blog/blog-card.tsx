import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  /** h2 on the blog listing (directly under the page h1), h3 inside a titled module. */
  headingLevel?: "h2" | "h3";
}

export function BlogCard({ post, headingLevel: Heading = "h2" }: BlogCardProps) {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const { slug, frontmatter, readingTime } = post;
  // Frontmatter dates are date-only, so format in UTC to avoid an off-by-one day.
  const date = new Date(frontmatter.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      aria-label={frontmatter.title}
      className="sheet block h-full border-t-[3px] border-t-red p-4"
    >
      <p className="font-mono text-[0.6875rem] text-ink-muted">
        <time dateTime={frontmatter.date}>{date}</time> · {readingTime} {t("min_read")}
      </p>
      <Heading className="mt-2 font-display text-lg font-bold leading-snug">{frontmatter.title}</Heading>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
        {frontmatter.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {frontmatter.tags.map((tag) => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
