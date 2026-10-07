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
import { Hero } from "@/components/sections/hero";
import { CodeWindow } from "@/components/sections/code-window";
import { Proof } from "@/components/sections/proof";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("Hero", () => {
  it("renders one h1 and both calls to action", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(hrefs(container)).toEqual(["/#contact", "/#services"]);
  });
});

describe("CodeWindow", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<CodeWindow />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Proof", () => {
  it("shows the four confirmed numbers as static text", () => {
    const { container } = render(<Proof />);
    for (const value of ["10+", "10M+", "60%", "99.9%"]) {
      expect(container.textContent).toContain(value);
    }
  });

  it("lists the certifications", () => {
    const { container } = render(<Proof />);
    expect(container.textContent).toContain("CKA");
    expect(container.textContent).toContain("JNCIS-ENT");
  });
});

describe("Services", () => {
  it("links each of the 8 services to its detail page", () => {
    const { container } = render(<Services />);
    const links = hrefs(container);
    expect(links.length).toBe(8);
    expect(links).toContain("/services/ci-cd");
    expect(links).toContain("/services/consulting");
  });
});

describe("AboutTeaser", () => {
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

describe("Contact", () => {
  it("exposes the contact anchor, the form and direct contact links", () => {
    const { container, getByTestId } = render(<Contact />);
    expect(container.querySelector("section")?.id).toBe("contact");
    expect(getByTestId("contact-form")).toBeInTheDocument();
    expect(hrefs(container)).toContain("mailto:info@skynet.hosting");
  });
});
