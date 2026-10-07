import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getRelatedServices } from "@/lib/services";

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("ServicesPage");
  const related = getRelatedServices(currentSlug);

  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("related_services")}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {related.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="card-surface flex items-center gap-3 p-4 text-sm font-semibold transition-colors hover:border-primary"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {t(`${service.key}_title`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
