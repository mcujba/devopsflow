import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("redirects for removed pages", () => {
  it("send /services and /contact to the home sections in every locale", async () => {
    const redirects = await nextConfig.redirects!();
    const map = Object.fromEntries(redirects.map((r) => [r.source, r.destination]));

    expect(map).toEqual({
      "/services": "/#services",
      "/contact": "/#contact",
      "/en/services": "/#services",
      "/en/contact": "/#contact",
      "/:locale(ro|ru)/services": "/:locale#services",
      "/:locale(ro|ru)/contact": "/:locale#contact",
    });
    expect(redirects.every((r) => r.permanent === true)).toBe(true);
  });
});
