import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { CERTIFICATIONS } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Footer");
  const tServices = useTranslations("ServicesPage");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-bold tracking-tight">DevOpsFlow</p>
          <p className="mt-3 text-sm text-muted-foreground">{t("description")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("location")}</p>
        </div>

        <nav aria-label={t("services")}>
          <h2 className="text-sm font-semibold">{t("services")}</h2>
          <ul className="mt-3 space-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tServices(`${service.key}_title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("company")}>
          <h2 className="text-sm font-semibold">{t("company")}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <ul className="flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert} className="rounded-md border border-border px-2 py-0.5">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        &copy; {year} DevOpsFlow. {t("rights")}
      </div>
    </footer>
  );
}
