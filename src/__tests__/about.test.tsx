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
import { AboutHero, AboutTimeline, AboutCTA } from "@/components/about/about-sections";

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
    for (const key of ["moldtelecom", "orange", "saltedge", "gilat", "alexhost", "ebs", "duocircle", "skynet"]) {
      expect(container.textContent).toContain(`tl_${key}_company`);
    }
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
