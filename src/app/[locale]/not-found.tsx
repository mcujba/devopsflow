import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-gradient font-mono text-sm font-bold">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("cta")}
      </Link>
    </section>
  );
}
