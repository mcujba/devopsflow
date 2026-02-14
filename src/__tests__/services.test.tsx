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
  usePathname: () => "/services",
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { render } from "@testing-library/react";
import { ServicesHero } from "@/components/sections/services-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ServicesCTA } from "@/components/sections/services-cta";

describe("ServicesHero", () => {
  it("renders heading and subtitle", () => {
    const { container } = render(<ServicesHero />);
    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(container.textContent).toContain("title");
    expect(container.textContent).toContain("subtitle");
  });
});

describe("ServicesGrid", () => {
  it("renders all 8 service cards", () => {
    const { container } = render(<ServicesGrid />);
    expect(container.textContent).toContain("ci_cd_title");
    expect(container.textContent).toContain("kubernetes_title");
    expect(container.textContent).toContain("cloud_title");
    expect(container.textContent).toContain("monitoring_title");
    expect(container.textContent).toContain("security_title");
    expect(container.textContent).toContain("networking_title");
    expect(container.textContent).toContain("linux_title");
    expect(container.textContent).toContain("consulting_title");
  });

  it("renders feature lists for each service", () => {
    const { container } = render(<ServicesGrid />);
    expect(container.textContent).toContain("ci_cd_f1");
    expect(container.textContent).toContain("kubernetes_f1");
    expect(container.textContent).toContain("security_f1");
    expect(container.textContent).toContain("consulting_f1");
  });

  it("renders tools badges for each service", () => {
    const { container } = render(<ServicesGrid />);
    expect(container.textContent).toContain("ci_cd_tools");
    expect(container.textContent).toContain("kubernetes_tools");
    expect(container.textContent).toContain("networking_tools");
  });
});

describe("ServicesCTA", () => {
  it("renders CTA heading and button", () => {
    const { container } = render(<ServicesCTA />);
    expect(container.querySelector("h2")).toBeInTheDocument();
    expect(container.textContent).toContain("cta_title");
    expect(container.querySelectorAll("a").length).toBeGreaterThanOrEqual(1);
  });
});
