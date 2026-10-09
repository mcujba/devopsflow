import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Unit>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
        <p className="lcd block text-center font-mono text-5xl" aria-hidden="true">
          404
        </p>
        <div>
          <h1 className="display text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="relief mt-3 text-ink-muted">{t("description")}</p>
          <Link href="/" className="key-red mt-5">
            {t("cta")}
          </Link>
        </div>
      </div>
    </Unit>
  );
}
