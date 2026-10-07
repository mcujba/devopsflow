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
import NotFound from "@/app/[locale]/not-found";

describe("NotFound", () => {
  it("renders a localized heading and a link home", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("h1")?.textContent).toBe("title");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/");
  });
});
