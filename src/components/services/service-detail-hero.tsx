import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Socket } from "@/components/rack/port";
import { getServiceBySlug } from "@/lib/services";

export function ServiceDetailHero({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <div>
      <Link href="/#services" className="engraved inline-flex min-h-11 items-center hover:text-ink">
        ← {t("back_to_services")}
      </Link>
      <div className="mt-3 grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
        <Socket className="mt-2 h-10" />
        <div>
          <h1 className="display text-3xl leading-tight sm:text-4xl">{t(`${service.key}_title`)}</h1>
          <p className="relief mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {t(`${service.key}_desc`)}
          </p>
        </div>
      </div>
    </div>
  );
}
