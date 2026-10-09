import { describe, it, expect, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { Unit } from "@/components/rack/unit";
import { Lcd } from "@/components/rack/lcd";
import { PortLink } from "@/components/rack/port";

describe("Unit", () => {
  it("renders a section with its anchor id and hides the mounting ears from assistive tech", () => {
    const { container } = render(
      <Unit id="services">
        <p>content</p>
      </Unit>,
    );
    const section = container.querySelector("section");
    expect(section?.id).toBe("services");
    expect(section?.textContent).toBe("content");
    for (const ear of container.querySelectorAll(".ear")) {
      expect(ear.getAttribute("aria-hidden")).toBe("true");
    }
  });
});

describe("Lcd", () => {
  it("exposes each reading as a real term and value pair", () => {
    const { container } = render(
      <Lcd
        items={[
          { label: "UPTIME SLA", value: "99.9%" },
          { label: "YEARS", value: "10+" },
        ]}
      />,
    );
    expect(container.querySelector("dl")).not.toBeNull();
    expect(Array.from(container.querySelectorAll("dt")).map((n) => n.textContent)).toEqual(["UPTIME SLA", "YEARS"]);
    expect(Array.from(container.querySelectorAll("dd")).map((n) => n.textContent)).toEqual(["99.9%", "10+"]);
  });
});

describe("PortLink", () => {
  it("is a link named by its visible label, with a decorative socket", () => {
    const { container } = render(<PortLink href="/services/kubernetes" label="K8s" />);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/services/kubernetes");
    expect(link?.textContent).toBe("K8s");
    expect(container.querySelector(".socket")?.getAttribute("aria-hidden")).toBe("true");
  });
});
