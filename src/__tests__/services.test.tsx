import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => (key.endsWith("_tools") ? "Terraform, Helm, ArgoCD" : key),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { services, getRelatedServices } from "@/lib/services";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceTools } from "@/components/services/service-tools";
import { RelatedServices } from "@/components/services/related-services";
import { CtaBand } from "@/components/sections/cta-band";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("service registry", () => {
  it("keeps the 8 services with unique slugs", () => {
    expect(services.length).toBe(8);
    expect(new Set(services.map((s) => s.slug)).size).toBe(8);
  });

  it("wraps around when picking related services", () => {
    expect(getRelatedServices("consulting").map((s) => s.slug)).toEqual(["ci-cd", "kubernetes", "cloud"]);
  });
});

describe("ServiceDetailHero", () => {
  it("renders one h1 and a link back to the services section", () => {
    const { container } = render(<ServiceDetailHero slug="kubernetes" />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(container.textContent).toContain("kubernetes_title");
    expect(hrefs(container)).toContain("/#services");
  });
});

describe("ServiceFeatures", () => {
  it("lists the four features", () => {
    const { container } = render(<ServiceFeatures slug="ci-cd" />);
    expect(container.querySelectorAll("li").length).toBe(4);
    expect(container.textContent).toContain("ci_cd_f4");
  });
});

describe("ServiceTools", () => {
  it("splits the comma-separated tools into separate items", () => {
    const { container } = render(<ServiceTools slug="cloud" />);
    const items = Array.from(container.querySelectorAll("li")).map((li) => li.textContent);
    expect(items).toEqual(["Terraform", "Helm", "ArgoCD"]);
  });
});

describe("RelatedServices", () => {
  it("links to three other services, never the current one", () => {
    const { container } = render(<RelatedServices currentSlug="linux" />);
    const links = hrefs(container);
    expect(links.length).toBe(3);
    expect(links).not.toContain("/services/linux");
  });
});

describe("CtaBand", () => {
  it("sends visitors to the contact section", () => {
    const { container } = render(<CtaBand />);
    expect(hrefs(container)).toEqual(["/#contact"]);
  });
});
