import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/contact/contact-form", () => ({
  ContactForm: () => <form data-testid="contact-form" />,
}));

import { render } from "@testing-library/react";
import type { BlogPost } from "@/lib/blog";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { BlogTray } from "@/components/sections/blog-tray";
import { Contact } from "@/components/sections/contact";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

const post: BlogPost = {
  slug: "first-post",
  frontmatter: {
    title: "First Post",
    description: "About the first post",
    date: "2025-01-15",
    tags: ["kubernetes"],
    locale: "en",
    author: "Maxim Cujba",
  },
  readingTime: 4,
};

describe("Hero", () => {
  it("renders one h1 with the accent word emphasized", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(container.querySelector("h1 em")?.textContent).toBe("title_2");
  });

  it("shows the four confirmed numbers on the display as static text", () => {
    const { container } = render(<Hero />);
    const values = Array.from(container.querySelectorAll("dd")).map((n) => n.textContent);
    expect(values).toEqual(["99.9%", "10M+", "10+", "60%"]);
  });

  it("has one port per service and a contact key", () => {
    const { container } = render(<Hero />);
    const links = hrefs(container);
    expect(links.filter((h) => h.startsWith("/services/")).length).toBe(8);
    expect(links).toContain("/services/ci-cd");
    expect(links[links.length - 1]).toBe("/#contact");
  });
});

describe("Services", () => {
  it("is the #services anchor and links each of the 8 services to its detail page", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("section")?.id).toBe("services");
    const links = hrefs(container);
    expect(links.length).toBe(8);
    expect(links).toContain("/services/consulting");
  });
});

describe("AboutTeaser", () => {
  it("shows the founder's photo with his name as alt text", () => {
    const { container } = render(<AboutTeaser />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("founder_name");
    expect(img?.getAttribute("src")).toContain("maxim-cujba.jpg");
  });

  it("links to the full about page and omits STM Telecom", () => {
    const { container } = render(<AboutTeaser />);
    expect(hrefs(container)).toContain("/about");
    expect(container.textContent).not.toContain("tl_stm");
    expect(container.textContent).toContain("tl_duocircle_company");
  });
});

describe("Process", () => {
  it("renders the four steps in order", () => {
    const { container } = render(<Process />);
    const items = Array.from(container.querySelectorAll("li")).map((li) => li.textContent);
    expect(items.length).toBe(4);
    expect(items[0]).toContain("discovery_title");
    expect(items[3]).toContain("support_title");
  });
});

describe("BlogTray", () => {
  it("lists the given posts and links to the full blog", () => {
    const { container } = render(<BlogTray posts={[post]} />);
    expect(container.querySelector("section")?.id).toBe("blog");
    const links = hrefs(container);
    expect(links).toContain("/blog/first-post");
    expect(links).toContain("/blog");
  });

  it("nests post titles under the module heading, so the page outline is not flat", () => {
    const { container } = render(<BlogTray posts={[post]} />);
    expect(container.querySelector("h2")?.textContent).toBe("blog_title");
    expect(container.querySelector("h3")?.textContent).toBe("First Post");
    expect(container.querySelector('[role="heading"]')).toBeNull();
  });

  it("names each card link by the post title alone", () => {
    const { container } = render(<BlogTray posts={[post]} />);
    expect(container.querySelector('a[href="/blog/first-post"]')?.getAttribute("aria-label")).toBe("First Post");
  });

  it("renders nothing when the locale has no posts, instead of an empty tray", () => {
    const { container } = render(<BlogTray posts={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("Contact", () => {
  it("exposes the contact anchor, the form and direct contact links", () => {
    const { container, getByTestId } = render(<Contact />);
    expect(container.querySelector("section")?.id).toBe("contact");
    expect(getByTestId("contact-form")).toBeInTheDocument();
    expect(hrefs(container)).toContain("mailto:info@skynet.hosting");
  });

  it("lists the four contact details as a plain list", () => {
    const { container } = render(<Contact />);
    expect(container.querySelectorAll("ul > li").length).toBe(4);
    expect(container.querySelector("dl")).toBeNull();
  });
});
