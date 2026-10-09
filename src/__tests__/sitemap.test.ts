import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

const entries = sitemap();
const urls = entries.map((entry) => entry.url);

describe("sitemap", () => {
  it("lists home, about, blog and all services in every locale", () => {
    for (const url of [
      "https://devopsflow.io",
      "https://devopsflow.io/ro",
      "https://devopsflow.io/ru/about",
      "https://devopsflow.io/blog",
      "https://devopsflow.io/certifications",
      "https://devopsflow.io/ru/certifications",
      "https://devopsflow.io/services/ci-cd",
      "https://devopsflow.io/ro/services/kubernetes",
      "https://devopsflow.io/ru/services/consulting",
    ]) {
      expect(urls).toContain(url);
    }
  });

  it("lists the existing blog posts", () => {
    expect(urls).toContain("https://devopsflow.io/blog/getting-started-with-kubernetes");
    expect(urls).toContain("https://devopsflow.io/ro/blog/kubernetes-on-budget-rancher-rke2-hetzner");
  });

  it("omits the removed listing and contact pages", () => {
    expect(urls.filter((url) => /\/(services|contact)$/.test(url))).toEqual([]);
  });

  it("dates blog posts from their frontmatter and leaves static pages undated", () => {
    const post = entries.find(
      (entry) => entry.url === "https://devopsflow.io/blog/getting-started-with-kubernetes",
    );
    expect(post?.lastModified).toBe("2025-01-15");
    expect(entries.find((entry) => entry.url === "https://devopsflow.io/about")?.lastModified).toBeUndefined();
  });

  it("has no duplicates", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("attaches hreflang alternates to each entry", () => {
    const about = entries.find((entry) => entry.url === "https://devopsflow.io/ro/about");
    expect(about?.alternates?.languages).toEqual({
      en: "https://devopsflow.io/about",
      ro: "https://devopsflow.io/ro/about",
      ru: "https://devopsflow.io/ru/about",
      "x-default": "https://devopsflow.io/about",
    });
  });
});

describe("robots", () => {
  it("allows crawling and points to the sitemap", () => {
    const config = robots();
    expect(config.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(config.sitemap).toBe("https://devopsflow.io/sitemap.xml");
  });
});
