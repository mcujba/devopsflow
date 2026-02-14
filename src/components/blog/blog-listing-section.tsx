"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/blog";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

interface BlogListingSectionProps {
  posts: BlogPost[];
}

export function BlogListingSection({ posts }: BlogListingSectionProps) {
  const t = useTranslations("Blog");

  if (posts.length === 0) {
    return (
      <p className="text-center text-lg text-muted-foreground">
        {t("no_posts")}
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </motion.div>
  );
}
