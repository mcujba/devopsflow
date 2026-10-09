import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { CERTIFICATIONS } from "@/lib/site";

const linkClass = "inline-flex min-h-8 items-center text-sm text-desk-muted hover:text-desk-ink";

export function Footer() {
  const t = useTranslations("Footer");
  const tServices = useTranslations("ServicesPage");
  const year = new Date().getFullYear();

  return (
    <footer className="on-desk px-2 pt-8 pb-6 text-desk-ink">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">DevOpsFlow</p>
          <p className="mt-2 text-sm text-desk-muted">{t("description")}</p>
          <p className="mt-1 text-xs text-desk-muted">{t("location")}</p>
        </div>

        <nav aria-label={t("services")}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">{t("services")}</h2>
          <ul className="mt-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkClass}>
                  {tServices(`${service.key}_title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("company")}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">{t("company")}</h2>
          <ul className="mt-2">
            <li>
              <Link href="/about" className={linkClass}>
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className={linkClass}>
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link href="/#contact" className={linkClass}>
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="flex flex-wrap content-start gap-1.5 font-mono text-xs text-desk-muted">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert} className="rounded-[3px] border border-desk-muted/50 px-2 py-0.5">
              {cert}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 border-t border-desk-muted/30 pt-4 text-center text-xs text-desk-muted">
        &copy; {year} DevOpsFlow. {t("rights")}
      </p>
    </footer>
  );
}
