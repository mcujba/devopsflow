import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const HIGHLIGHTS = ["duocircle", "ebs", "orange", "moldtelecom"] as const;

export function AboutTeaser() {
  const t = useTranslations("Home");
  const tAbout = useTranslations("AboutPage");

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[auto_1fr_1fr] lg:items-start">
        {/* Placeholder until the owner supplies a photo. */}
        <div
          aria-hidden="true"
          className="bg-gradient-solid flex h-28 w-28 items-center justify-center rounded-[14px] text-3xl font-extrabold text-white"
        >
          MC
        </div>

        <div>
          <p className="eyebrow">{t("about_label")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("about_title")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("about_p")}</p>
          <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
            {t("about_link")} →
          </Link>
        </div>

        <ul className="divide-y divide-border border-y border-border text-sm">
          {HIGHLIGHTS.map((key) => (
            <li key={key} className="flex items-baseline justify-between gap-4 py-3">
              <span>
                <span className="font-semibold">{tAbout(`tl_${key}_company`)}</span>
                <span className="block text-muted-foreground">{tAbout(`tl_${key}_role`)}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {tAbout(`tl_${key}_date`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
