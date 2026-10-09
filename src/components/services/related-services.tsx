import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Socket } from "@/components/rack/port";
import { getRelatedServices } from "@/lib/services";

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("ServicesPage");
  const related = getRelatedServices(currentSlug);

  return (
    <div>
      <h2 className="label-red">{t("related_services")}</h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {related.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="raised grid h-full grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3"
            >
              <Socket />
              <span className="display text-base">{t(`${service.key}_title`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
