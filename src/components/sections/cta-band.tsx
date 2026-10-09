import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaBand() {
  const t = useTranslations("ServicesPage");

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/20 pt-6">
      <div>
        <h2 className="display text-xl">{t("cta_title")}</h2>
        <p className="mt-1 max-w-xl text-sm text-ink-muted">{t("cta_description")}</p>
      </div>
      <Link href="/#contact" className="key-red">
        {t("cta_button")}
      </Link>
    </div>
  );
}
