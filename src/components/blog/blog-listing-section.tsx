import { useTranslations } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/blog";

interface BlogListingSectionProps {
  posts: BlogPost[];
}

export function BlogListingSection({ posts }: BlogListingSectionProps) {
  const t = useTranslations("Blog");

  if (posts.length === 0) {
    return <p className="text-center text-lg text-muted-foreground">{t("no_posts")}</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
