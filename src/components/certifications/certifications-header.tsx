import { useTranslations } from "next-intl";
import { Unit } from "@/components/rack/unit";
import { CREDLY_URL, LINKEDIN_URL } from "@/lib/site";

const linkClass = "key min-h-11 px-4 font-sans tracking-[0.12em]";

export function CertificationsHeader() {
  const t = useTranslations("Certifications");

  return (
    <Unit>
      <p className="label-red">{t("label")}</p>
      <h1 className="display mt-1 text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="relief mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">{t("intro")}</p>
      <p className="mt-5 flex flex-wrap gap-2">
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t("linkedin")} ↗
        </a>
        <a href={CREDLY_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t("credly")} ↗
        </a>
      </p>
    </Unit>
  );
}
