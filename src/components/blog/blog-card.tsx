import { Calendar, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
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
      className="card-surface block h-full p-6 transition-colors hover:border-primary"
    >
      <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        {frontmatter.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-border px-2.5 py-0.5">
            {tag}
          </li>
        ))}
      </ul>
      <h2 className="mt-4 text-lg font-bold leading-snug">{frontmatter.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {frontmatter.description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={frontmatter.date}>{date}</time>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {readingTime} {t("min_read")}
        </span>
      </div>
    </Link>
  );
}
