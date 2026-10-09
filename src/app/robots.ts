import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI crawlers are allowed on purpose: the site wants to be found and cited.
 * Search and user-triggered agents decide whether pages appear in AI answers;
 * training crawlers decide whether the content can inform the models themselves.
 * Listing them makes the policy explicit instead of implied by the wildcard.
 */
const AI_CRAWLERS = [
  // OpenAI
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini grounding and training control) and Apple
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
