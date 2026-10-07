import { describe, it, expect, vi } from "vitest";

// Only the matcher is under test; the middleware factory needs the Next.js runtime.
vi.mock("next-intl/middleware", () => ({ default: () => () => undefined }));

import { config } from "@/middleware";
import { routing } from "@/i18n/routing";

const matcher = new RegExp(`^${config.matcher}$`);
const runsMiddleware = (path: string) => matcher.test(path);

describe("locale middleware matcher", () => {
  it("skips the generated Open Graph image of every locale", () => {
    for (const locale of routing.locales) {
      expect(runsMiddleware(`/${locale}/opengraph-image`)).toBe(false);
    }
  });

  it("still handles pages whose slug merely contains 'opengraph-image'", () => {
    expect(runsMiddleware("/blog/how-to-build-an-opengraph-image")).toBe(true);
    expect(runsMiddleware("/ro/blog/opengraph-image-ghid")).toBe(true);
    expect(runsMiddleware("/opengraph-image-guide")).toBe(true);
  });

  it("keeps handling ordinary pages and skipping static files", () => {
    expect(runsMiddleware("/")).toBe(true);
    expect(runsMiddleware("/ru/about")).toBe(true);
    expect(runsMiddleware("/favicon.ico")).toBe(false);
    expect(runsMiddleware("/_next/static/chunk.js")).toBe(false);
  });
});
