import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/en/services", destination: "/#services", permanent: true },
      { source: "/en/contact", destination: "/#contact", permanent: true },
      { source: "/:locale(ro|ru)/services", destination: "/:locale#services", permanent: true },
      { source: "/:locale(ro|ru)/contact", destination: "/:locale#contact", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
