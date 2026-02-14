"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations("Blog");
  const { slug, frontmatter, readingTime } = post;

  return (
    <motion.div variants={item}>
      <Link href={`/blog/${slug}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />

          <div className="relative">
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="mt-4 text-lg font-semibold leading-snug">
              {frontmatter.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {frontmatter.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} {t("min_read")}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {t("read_more")}
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
