import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/blog";

export function BlogTray({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("Home");

  if (posts.length === 0) return null;

  return (
    <Unit id="blog" labelledBy="blog-title">
      <div className="flex flex-wrap items-end justify-between gap-x-6">
        <div>
          <p className="label-red">{t("blog_label")}</p>
          <p id="blog-title" role="heading" aria-level={2} className="display mt-1 text-2xl sm:text-3xl">
            {t("blog_title")}
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4"
        >
          {t("blog_all")} →
        </Link>
      </div>
      <ul className="inset mt-4 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </Unit>
  );
}
