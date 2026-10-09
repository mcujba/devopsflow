import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { Socket } from "@/components/rack/port";
import { services } from "@/lib/services";

export function Services() {
  const t = useTranslations("Services");
  const tPage = useTranslations("ServicesPage");

  return (
    <Unit id="services" labelledBy="services-title">
      <p className="label-red">{t("label")}</p>
      <h2 id="services-title" className="display mt-1 text-2xl sm:text-3xl">
        {t("title")}
      </h2>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="raised grid h-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 p-3"
            >
              <Socket className="mt-0.5" />
              <span>
                <span className="display block text-base">{tPage(`${service.key}_title`)}</span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                  {t(`${service.key}_short`)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Unit>
  );
}
