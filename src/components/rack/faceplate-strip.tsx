import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function FaceplateStrip() {
  const t = useTranslations("Nav");

  return (
    <header className="unit unit-1u">
      <div className="ear" aria-hidden="true">
        <span className="ear-hole" />
      </div>
      <div className="unit-face flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <Link href="/" className="engraved inline-flex min-h-11 items-center tracking-[0.3em]">
          DevOps<span className="text-red">Flow</span>
        </Link>

        <nav aria-label={t("main_label")} className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex flex-wrap gap-x-5">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="engraved inline-flex min-h-11 items-center gap-2 hover:text-ink">
                  <span className="led" aria-hidden="true" />
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LanguageSwitcher label={t("language")} />
      </div>
      <div className="ear ear-right" aria-hidden="true">
        <span className="ear-hole" />
      </div>
    </header>
  );
}
