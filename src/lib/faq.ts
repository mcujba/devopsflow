/** Which questions exist. The texts live in messages/*.json under `Faq`. */

const GENERAL_QUESTIONS = 7;
const QUESTIONS_PER_SERVICE = 3;

export interface FaqItem {
  /** Translation keys in the `Faq` namespace. */
  question: string;
  answer: string;
  /** Internal page that backs the answer, shown as a link under it. */
  href?: string;
}

/** Answers that point to the certifications page. */
const LINKS: Record<string, string> = {
  home_q6: "/certifications",
  kubernetes_q2: "/certifications",
};

/** `scope` is "home" or a service key from the service registry (e.g. "ci_cd"). */
export function faqItems(scope: string): FaqItem[] {
  const count = scope === "home" ? GENERAL_QUESTIONS : QUESTIONS_PER_SERVICE;
  return Array.from({ length: count }, (_, index) => {
    const question = `${scope}_q${index + 1}`;
    return { question, answer: `${scope}_a${index + 1}`, href: LINKS[question] };
  });
}
