import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import type { Locale } from "@/i18n/routing";
import { mdxComponents } from "@/lib/mdx-components";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: Locale;
  author: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: number;
}

export interface BlogPostWithContent extends BlogPost {
  content: React.ReactElement;
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(locale: Locale): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const suffix = `.${locale}.mdx`;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(suffix));

  const posts = files.map((filename) => {
    const slug = filename.replace(suffix, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: data as BlogFrontmatter,
      readingTime: estimateReadingTime(content),
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export async function getPostBySlug(
  slug: string,
  locale: Locale,
): Promise<BlogPostWithContent | null> {
  const filename = `${slug}.${locale}.mdx`;
  const filePath = path.join(CONTENT_DIR, filename);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");

  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: "github-light",
                dark: "tokyo-night",
              },
              defaultColor: false,
            },
          ],
        ],
      },
    },
  });

  return {
    slug,
    frontmatter,
    readingTime: estimateReadingTime(raw),
    content,
  };
}

export function getAllPostSlugs(locale: Locale): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const suffix = `.${locale}.mdx`;
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(suffix))
    .map((f) => f.replace(suffix, ""));
}
