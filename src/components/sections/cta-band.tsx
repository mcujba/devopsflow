import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaBand() {
  const t = useTranslations("ServicesPage");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="card-surface p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("cta_title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("cta_description")}</p>
        <Link href="/#contact" className="btn-primary mt-6">
          {t("cta_button")}
        </Link>
      </div>
    </section>
  );
}
