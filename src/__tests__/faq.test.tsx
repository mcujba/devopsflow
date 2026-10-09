import { describe, it, expect, vi } from "vitest";
import en from "../../messages/en.json";

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
import { Faq } from "@/components/sections/faq";
import { faqItems } from "@/lib/faq";
import { faqJsonLd } from "@/lib/seo";
import { services } from "@/lib/services";

function jsonLd(container: HTMLElement) {
  return JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
}

describe("faqItems", () => {
  it("has seven general questions and three per service, each with a translation", () => {
    expect(faqItems("home").length).toBe(7);
    const faq = (en as { Faq: Record<string, string> }).Faq;
    for (const scope of ["home", ...services.map((s) => s.key)]) {
      const items = faqItems(scope);
      if (scope !== "home") expect(items.length, scope).toBe(3);
      for (const item of items) {
        expect(faq[item.question], item.question).toBeTruthy();
        expect(faq[item.answer], item.answer).toBeTruthy();
      }
    }
  });

  it("does not publish a pricing question", () => {
    // "Reduce our cloud costs" is a service question; what must not appear is the site's own pricing.
    const faq = (en as { Faq: Record<string, string> }).Faq;
    const questions = Object.entries(faq).filter(([key]) => /_q\d+$/.test(key)).map(([, text]) => text);
    expect(questions.filter((text) => /how much|pricing|your (price|rate)|hourly|\$|€/i.test(text))).toEqual([]);
  });
});

describe("Faq on the home page", () => {
  it("shows every question and answer as visible text under one heading", () => {
    const { container } = render(<Faq scope="home" id="faq" />);
    expect(container.querySelector("section")?.id).toBe("faq");
    expect(container.querySelectorAll("h2").length).toBe(1);
    const questions = Array.from(container.querySelectorAll("h3")).map((n) => n.textContent);
    expect(questions).toEqual(["home_q1", "home_q2", "home_q3", "home_q4", "home_q5", "home_q6", "home_q7"]);
    expect(container.textContent).toContain("home_a4");
    expect(container.querySelector("details")).toBeNull();
  });

  it("links the certifications answer to the certifications page", () => {
    const { container } = render(<Faq scope="home" />);
    expect(container.querySelector('a[href="/certifications"]')).not.toBeNull();
  });

  it("publishes the same questions as FAQPage structured data", () => {
    const { container } = render(<Faq scope="home" />);
    const data = jsonLd(container);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity.map((q: { name: string }) => q.name)).toEqual(["home_q1", "home_q2", "home_q3", "home_q4", "home_q5", "home_q6", "home_q7"]);
    expect(data.mainEntity[0].acceptedAnswer).toEqual({ "@type": "Answer", text: "home_a1" });
  });
});

describe("Faq on a service page", () => {
  it("shows that service's three questions", () => {
    const { container } = render(<Faq scope="kubernetes" />);
    expect(Array.from(container.querySelectorAll("h3")).map((n) => n.textContent)).toEqual(["kubernetes_q1", "kubernetes_q2", "kubernetes_q3"]);
    expect(jsonLd(container).mainEntity.length).toBe(3);
  });
});

describe("faqJsonLd", () => {
  it("builds a FAQPage from question and answer pairs", () => {
    expect(faqJsonLd([{ question: "Q?", answer: "A." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } }],
    });
  });
});
