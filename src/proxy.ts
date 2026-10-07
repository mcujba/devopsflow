import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Next.js needs a static string here, so the locales are repeated from routing.ts.
  // Only the exact generated image path is skipped; slugs that merely contain
  // "opengraph-image" still go through locale handling.
  matcher: "/((?!api|trpc|_next|_vercel|(?:en|ro|ru)/opengraph-image$|.*\\..*).*)",
};
