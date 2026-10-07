import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";

export function Services() {
  const t = useTranslations("Services");
  const tPage = useTranslations("ServicesPage");

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("label")}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="card-surface block h-full p-5 transition-colors hover:border-primary"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{tPage(`${service.key}_title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${service.key}_short`)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
