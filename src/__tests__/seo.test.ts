import { describe, it, expect } from "vitest";
import {
  localePath,
  absoluteUrl,
  languageAlternates,
  pageMetadata,
  personJsonLd,
  professionalServiceJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  blogPostingJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

describe("localePath", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/about")).toBe("/about");
  });

  it("prefixes other locales without a trailing slash", () => {
    expect(localePath("ro", "/")).toBe("/ro");
    expect(localePath("ru", "/services/kubernetes")).toBe("/ru/services/kubernetes");
  });
});

describe("absoluteUrl", () => {
  it("builds absolute URLs on the production host", () => {
    expect(absoluteUrl("en", "/")).toBe("https://devopsflow.io");
    expect(absoluteUrl("ro", "/about")).toBe("https://devopsflow.io/ro/about");
  });
});

describe("languageAlternates", () => {
  it("lists every locale plus x-default", () => {
    expect(languageAlternates("/about")).toEqual({
      en: "/about",
      ro: "/ro/about",
      ru: "/ru/about",
      "x-default": "/about",
    });
  });

  it("supports absolute URLs and a subset of locales", () => {
    expect(languageAlternates("/blog/x", { absolute: true, locales: ["ro"] })).toEqual({
      ro: "https://devopsflow.io/ro/blog/x",
    });
  });
});

describe("pageMetadata", () => {
  it("sets canonical, hreflang and Open Graph for the page", () => {
    const meta = pageMetadata({
      locale: "ro",
      path: "/about",
      title: "Despre",
      description: "Descriere",
    });
    expect(meta.alternates?.canonical).toBe("/ro/about");
    expect(meta.alternates?.languages).toHaveProperty("x-default", "/about");
    expect(meta.openGraph).toMatchObject({ url: "/ro/about", locale: "ro_RO", title: "Despre" });
  });

  it("attaches the locale's Open Graph image so inner pages get a share preview", () => {
    const meta = pageMetadata({ locale: "en", path: "/about", title: "About", description: "D" });
    const image = { url: "/en/opengraph-image", width: 1200, height: 630, alt: "DevOpsFlow" };
    expect(meta.openGraph?.images).toEqual([image]);
    expect(meta.twitter?.images).toEqual([image]);
  });
});

describe("pageMetadata for articles", () => {
  it("marks blog posts as articles with their publication date", () => {
    const meta = pageMetadata({
      locale: "en",
      path: "/blog/p",
      title: "T",
      description: "D",
      publishedTime: "2025-01-15",
    });
    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2025-01-15" });
  });

  it("keeps ordinary pages typed as website", () => {
    const meta = pageMetadata({ locale: "en", path: "/about", title: "T", description: "D" });
    expect(meta.openGraph).toMatchObject({ type: "website" });
  });
});

describe("JSON-LD builders", () => {
  it("describes the person without STM Telecom", () => {
    const json = JSON.stringify(personJsonLd("en"));
    expect(json).toContain('"@type":"Person"');
    expect(json).toContain("Maxim Cujba");
    expect(json).toContain("CKA");
    expect(json).not.toContain("STM");
  });

  it("includes the founder's photo", () => {
    expect(personJsonLd("en").image).toBe("https://devopsflow.io/maxim-cujba.jpg");
  });

  it("describes the business and links it to the person", () => {
    const data = professionalServiceJsonLd("en", "desc");
    expect(data["@type"]).toBe("ProfessionalService");
    expect(data.url).toBe("https://devopsflow.io");
    expect(data.founder).toEqual({ "@id": "https://devopsflow.io/#person" });
  });

  it("describes a service at its localized URL", () => {
    const data = serviceJsonLd({ locale: "ru", slug: "kubernetes", name: "K8s", description: "d" });
    expect(data.url).toBe("https://devopsflow.io/ru/services/kubernetes");
  });

  it("numbers breadcrumb items from 1", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", url: "https://devopsflow.io" },
      { name: "K8s", url: "https://devopsflow.io/services/kubernetes" },
    ]);
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it("describes a blog post with its language", () => {
    const data = blogPostingJsonLd({
      locale: "ro",
      slug: "post",
      title: "T",
      description: "D",
      date: "2025-01-15",
    });
    expect(data.inLanguage).toBe("ro");
    expect(data.url).toBe("https://devopsflow.io/ro/blog/post");
  });

  it("credits blog posts to the founder, not to a brand typed as a person", () => {
    const data = blogPostingJsonLd({ locale: "en", slug: "p", title: "T", description: "D", date: "2025-01-15" });
    expect(data.author).toEqual({
      "@type": "Person",
      "@id": "https://devopsflow.io/#person",
      name: "Maxim Cujba",
    });
  });

  it("names the business wherever it is referenced, so inner pages stand alone", () => {
    const business = { "@id": "https://devopsflow.io/#business", name: "DevOpsFlow", url: "https://devopsflow.io" };
    expect(serviceJsonLd({ locale: "en", slug: "cloud", name: "C", description: "d" }).provider).toMatchObject(business);
    expect(
      blogPostingJsonLd({ locale: "en", slug: "p", title: "T", description: "D", date: "2025-01-15" }).publisher,
    ).toMatchObject(business);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so translated text cannot close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)");
  });
});
