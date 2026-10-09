import { describe, it, expect, vi } from "vitest";
import { existsSync } from "node:fs";

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

import { render } from "@testing-library/react";
import {
  certifications,
  certificationsByIssuer,
  currentCertifications,
  formatPeriod,
} from "@/lib/certifications";
import { CertificationsHeader } from "@/components/certifications/certifications-header";
import { CertificationList } from "@/components/certifications/certification-list";

const byId = (id: string) => certifications.find((c) => c.id === id)!;

describe("certification registry", () => {
  it("lists the 16 agreed credentials with unique ids", () => {
    expect(certifications.length).toBe(16);
    expect(new Set(certifications.map((c) => c.id)).size).toBe(16);
  });

  it("does not claim CCNP, and leaves out the excluded course certificate", () => {
    const text = JSON.stringify(certifications);
    expect(text).not.toContain("CCNP");
    expect(text).not.toMatch(/Udemy|KodeKloud/);
    expect(byId("cisco-route").name).toBe("Implementing Cisco IP Routing");
  });

  it("only points to files that exist and to https verification pages", () => {
    for (const cert of certifications) {
      if (cert.image) expect(existsSync(`public${cert.image}`), cert.image).toBe(true);
      if (cert.download) expect(existsSync(`public${cert.download}`), cert.download).toBe(true);
      if (cert.verifyUrl) expect(cert.verifyUrl).toMatch(/^https:\/\//);
    }
  });

  it("groups by issuer in a fixed order", () => {
    expect(certificationsByIssuer().map((g) => g.issuer)).toEqual([
      "linux-foundation", "juniper", "fortinet", "cisco", "mikrotik", "lpi", "skillsoft",
    ]);
  });
});

describe("formatPeriod", () => {
  it("shows the validity period when the credential expires", () => {
    expect(formatPeriod(byId("cka"), "en")).toBe("Apr 2024 – Apr 2027");
  });

  it("shows only the issue month when there is no expiry", () => {
    expect(formatPeriod(byId("fortianalyzer"), "en")).toBe("Feb 2020");
  });
});

describe("currentCertifications", () => {
  it("returns only credentials that are still valid on the given day", () => {
    expect(currentCertifications(new Date("2026-10-09")).map((c) => c.id)).toEqual(["cka"]);
    expect(currentCertifications(new Date("2027-05-01"))).toEqual([]);
  });
});

describe("CertificationsHeader", () => {
  it("has the page h1 and links to LinkedIn in a new tab", () => {
    const { container } = render(<CertificationsHeader />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    const link = container.querySelector('a[href="https://www.linkedin.com/in/mcujba"]');
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("CertificationList", () => {
  it("renders one titled module per issuer and one card per credential", () => {
    const { container } = render(<CertificationList />);
    expect(container.querySelectorAll("h2").length).toBe(7);
    expect(container.querySelectorAll("h3").length).toBe(16);
  });

  it("shows period and credential ID as text", () => {
    const { container } = render(<CertificationList />);
    expect(container.textContent).toContain("Apr 2024 – Apr 2027");
    expect(container.textContent).toContain("1711NA7019");
    expect(container.textContent).toContain("FORT042477");
  });

  it("opens verification links in a new tab, named after the credential", () => {
    const { container } = render(<CertificationList />);
    const link = container.querySelector('a[href="https://www.credly.com/badges/9a298f5a-7ed6-4302-958a-b5d828485aa9"]');
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link?.getAttribute("aria-label")).toBe("verify: CKA: Certified Kubernetes Administrator");
  });

  it("offers a download only where a certificate file exists", () => {
    const { container } = render(<CertificationList />);
    const downloads = Array.from(container.querySelectorAll("a[download]")).map((a) => a.getAttribute("href"));
    expect(downloads).toEqual(["/certificates/mtcwe.jpg", "/certificates/mtcna.jpg"]);
  });

  it("shows no verify link for a credential that has none", () => {
    const { container } = render(<CertificationList />);
    const card = Array.from(container.querySelectorAll("li")).find((li) => li.querySelector("h3")?.textContent === "NSE 5 Network Security Analyst")!;
    expect(card.querySelectorAll("a").length).toBe(0);
  });
});
