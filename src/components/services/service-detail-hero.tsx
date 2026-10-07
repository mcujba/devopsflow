import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getServiceBySlug } from "@/lib/services";

export function ServiceDetailHero({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;
  const Icon = service.icon;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
      <Link
        href="/#services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("back_to_services")}
      </Link>
      <Icon className="mt-8 h-8 w-8 text-primary" aria-hidden="true" />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {t(`${service.key}_title`)}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {t(`${service.key}_desc`)}
      </p>
    </section>
  );
}
