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
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

import { render } from "@testing-library/react";
import { FaceplateStrip } from "@/components/rack/faceplate-strip";
import { Footer } from "@/components/layout/footer";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("FaceplateStrip", () => {
  it("links to home sections with absolute anchors so they work from inner pages", () => {
    const { container } = render(<FaceplateStrip />);
    const links = hrefs(container);
    expect(links).toEqual(expect.arrayContaining(["/", "/#services", "/about", "/blog", "/#contact"]));
    expect(links).not.toContain("#services");
  });

  it("labels the navigation landmark in the visitor's language", () => {
    const { container } = render(<FaceplateStrip />);
    expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("main_label");
  });

  it("offers the three languages as keys, with the current one pressed", () => {
    const { container } = render(<FaceplateStrip />);
    const keys = Array.from(container.querySelectorAll('[role="radio"]'));
    expect(keys.map((k) => k.textContent)).toEqual(["en", "ro", "ru"]);
    expect(keys.map((k) => k.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
  });

  it("has no theme toggle", () => {
    const { container } = render(<FaceplateStrip />);
    expect(container.querySelectorAll("button").length).toBe(3);
  });
});

describe("Footer", () => {
  it("links every service to its own detail page", () => {
    const { container } = render(<Footer />);
    const links = hrefs(container);
    for (const slug of ["ci-cd", "kubernetes", "cloud", "monitoring", "security", "networking", "linux", "consulting"]) {
      expect(links).toContain(`/services/${slug}`);
    }
  });

  it("links to the certifications page and no longer claims CCNP", () => {
    const { container } = render(<Footer />);
    expect(hrefs(container)).toContain("/certifications");
    expect(container.textContent).not.toContain("CCNP");
    expect(container.textContent).toContain("JNCIS-ENT");
  });

  it("does not link to the removed listing and contact pages", () => {
    const { container } = render(<Footer />);
    const links = hrefs(container);
    expect(links).not.toContain("/services");
    expect(links).not.toContain("/contact");
  });
});
