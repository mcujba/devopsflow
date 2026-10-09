import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { JsonLd } from "@/components/json-ld";
import { faqItems } from "@/lib/faq";
import { faqJsonLd } from "@/lib/seo";

/**
 * Questions and answers as plain visible text, so readers, search engines and
 * AI assistants all get the same content without running JavaScript.
 */
export function Faq({ scope, id }: { scope: string; id?: string }) {
  const t = useTranslations("Faq");
  const items = faqItems(scope);
  const headingId = `${id ?? scope}-faq-title`;

  return (
    <Unit id={id} labelledBy={headingId}>
      <JsonLd
        data={faqJsonLd(items.map((item) => ({ question: t(item.question), answer: t(item.answer) })))}
      />
      <h2 id={headingId} className="display text-2xl sm:text-3xl">
        {t("title")}
      </h2>
      <div className="ledger mt-4 grid gap-x-10 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.question} className="py-4">
            <h3 className="display text-lg leading-snug">{t(item.question)}</h3>
            <p className="mt-1.5 leading-relaxed text-ink-muted">{t(item.answer)}</p>
            {item.href && (
              <Link
                href={item.href}
                className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4"
              >
                {t("see_certifications")} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </Unit>
  );
}
