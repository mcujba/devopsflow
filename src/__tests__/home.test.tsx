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
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock TerminalAnimation to avoid timer-related teardown issues
vi.mock("@/components/sections/terminal-animation", () => ({
  TerminalAnimation: () => <div data-testid="terminal-mock">Terminal</div>,
}));

import { render } from "@testing-library/react";
import { HeroSection } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { CertificationsSection } from "@/components/sections/certifications";
import { StatsSection } from "@/components/sections/stats";
import { ProcessSection } from "@/components/sections/process";
import { CTASection } from "@/components/sections/cta";

describe("HeroSection", () => {
  it("renders heading and CTAs", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(container.querySelectorAll("a").length).toBeGreaterThanOrEqual(2);
  });

  it("renders terminal animation", () => {
    const { getAllByTestId } = render(<HeroSection />);
    expect(getAllByTestId("terminal-mock").length).toBeGreaterThanOrEqual(1);
  });
});

describe("ServicesPreview", () => {
  it("renders section heading and service cards", () => {
    const { container } = render(<ServicesPreview />);
    expect(container.querySelector("h2")).toBeInTheDocument();
    expect(container.querySelectorAll("a").length).toBe(4);
  });
});

describe("StatsSection", () => {
  it("renders stat counters", () => {
    const { container } = render(<StatsSection />);
    expect(container.textContent).toContain("experience_label");
    expect(container.textContent).toContain("uptime_label");
  });
});

describe("ProcessSection", () => {
  it("renders 4 process steps", () => {
    const { container } = render(<ProcessSection />);
    expect(container.querySelector("h2")).toBeInTheDocument();
    expect(container.textContent).toContain("discovery_title");
    expect(container.textContent).toContain("support_title");
  });
});

describe("CertificationsSection", () => {
  it("renders certification badges", () => {
    const { container } = render(<CertificationsSection />);
    expect(container.textContent).toContain("CKA");
    expect(container.textContent).toContain("CCNP");
    expect(container.textContent).toContain("JNCIS-ENT");
  });
});

describe("CTASection", () => {
  it("renders CTA with form preview", () => {
    const { container } = render(<CTASection />);
    expect(container.querySelector("h2")).toBeInTheDocument();
    expect(container.querySelectorAll("label").length).toBeGreaterThanOrEqual(3);
  });
});
