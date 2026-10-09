import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

const HIGHLIGHTS = ["duocircle", "ebs", "orange", "moldtelecom"] as const;

export function AboutTeaser() {
  const t = useTranslations("Home");
  const tAbout = useTranslations("AboutPage");

  return (
    <Unit id="about" labelledBy="about-title">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr_1fr] lg:gap-8">
        <div className="sheet w-fit self-start p-2 pb-3">
          <Image
            src="/maxim-cujba.jpg"
            alt={tAbout("founder_name")}
            width={160}
            height={160}
            className="h-40 w-40 object-cover"
          />
          <p className="mt-2 text-center font-mono text-[0.6875rem] text-ink-muted">
            {tAbout("founder_role")}
          </p>
        </div>

        <div>
          <p className="label-red">{t("about_label")}</p>
          <h2 id="about-title" className="display mt-1 text-2xl sm:text-3xl">
            {t("about_title")}
          </h2>
          <p className="relief mt-3 leading-relaxed text-ink-muted">{t("about_p")}</p>
          <Link
            href="/about"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4"
          >
            {t("about_link")} →
          </Link>
        </div>

        <ul className="ledger content-start text-sm">
          {HIGHLIGHTS.map((key) => (
            <li key={key} className="flex items-baseline justify-between gap-4 py-2.5">
              <span>
                <span className="font-semibold">{tAbout(`tl_${key}_company`)}</span>
                <span className="block text-ink-muted">{tAbout(`tl_${key}_role`)}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-ink-muted">
                {tAbout(`tl_${key}_date`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Unit>
  );
}
