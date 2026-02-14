import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/blog",
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { render } from "@testing-library/react";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogListingSection } from "@/components/blog/blog-listing-section";
import type { BlogPost } from "@/lib/blog";

const mockPost: BlogPost = {
  slug: "test-post",
  frontmatter: {
    title: "Test Post Title",
    description: "A test post description",
    date: "2025-01-15",
    tags: ["kubernetes", "devops"],
    locale: "en",
    author: "Test Author",
  },
  readingTime: 5,
};

describe("BlogCard", () => {
  it("renders post title and description", () => {
    const { container } = render(<BlogCard post={mockPost} />);
    expect(container.textContent).toContain("Test Post Title");
    expect(container.textContent).toContain("A test post description");
  });

  it("renders tags", () => {
    const { container } = render(<BlogCard post={mockPost} />);
    expect(container.textContent).toContain("kubernetes");
    expect(container.textContent).toContain("devops");
  });

  it("renders reading time", () => {
    const { container } = render(<BlogCard post={mockPost} />);
    expect(container.textContent).toContain("5");
    expect(container.textContent).toContain("min_read");
  });

  it("links to the post slug", () => {
    const { container } = render(<BlogCard post={mockPost} />);
    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("href")).toBe("/blog/test-post");
  });
});

describe("BlogListingSection", () => {
  it("renders posts grid", () => {
    const posts = [
      mockPost,
      { ...mockPost, slug: "second-post", frontmatter: { ...mockPost.frontmatter, title: "Second Post" } },
    ];
    const { container } = render(<BlogListingSection posts={posts} />);
    expect(container.textContent).toContain("Test Post Title");
    expect(container.textContent).toContain("Second Post");
  });

  it("renders empty state when no posts", () => {
    const { container } = render(<BlogListingSection posts={[]} />);
    expect(container.textContent).toContain("no_posts");
  });
});
