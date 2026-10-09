import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { AboutHero, AboutTimeline, AboutCTA, AboutCertifications } from "@/components/about/about-sections";

describe("AboutHero", () => {
  it("renders the page h1", () => {
    const { container } = render(<AboutHero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
  });
});

describe("AboutTimeline", () => {
  it("omits STM Telecom and keeps the other employers", () => {
    const { container } = render(<AboutTimeline />);
    expect(container.textContent).not.toContain("tl_stm");
    for (const key of ["moldtelecom", "orange", "saltedge", "gilat", "alexhost", "ebs", "duocircle", "mit"]) {
      expect(container.textContent).toContain(`tl_${key}_company`);
    }
  });
});

describe("AboutTimeline current role", () => {
  it("lists the MIT-DEV role instead of the Skynet Hosting founder entry", () => {
    const { container } = render(<AboutTimeline />);
    expect(container.textContent).toContain("tl_mit_role");
    expect(container.textContent).not.toContain("tl_skynet");
  });

  it("links the company name to its site in a new tab, safely", () => {
    const { container } = render(<AboutTimeline />);
    const link = container.querySelector('a[href="https://mitdev.md"]');
    expect(link?.textContent).toBe("tl_mit_company");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("AboutCertifications", () => {
  it("summarizes credentials by issuer from the registry and links to the full page", () => {
    const { container } = render(<AboutCertifications />);
    expect(container.textContent).toContain("Juniper Networks");
    expect(container.textContent).not.toContain("CCNP");
    expect(container.querySelector('a[href="/certifications"]')).not.toBeNull();
  });
});

describe("AboutTimeline heading", () => {
  it("introduces the employers with an h2 so they are not read under the previous section", () => {
    const { container } = render(<AboutTimeline />);
    expect(container.querySelector("h2")?.textContent).toBe("timeline_label");
  });
});

describe("AboutCTA", () => {
  it("links to home sections instead of the removed pages", () => {
    const { container } = render(<AboutCTA />);
    const links = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("/#contact");
    expect(links).not.toContain("/contact");
    expect(links).not.toContain("/services");
  });
});
