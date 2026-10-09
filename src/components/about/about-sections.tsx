import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

/* ─── Hero ────────────────────────────────────────────── */

export function AboutHero() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <p className="engraved">{t("founder_name")}</p>
      <h1 className="display mt-2 max-w-3xl text-3xl leading-tight sm:text-5xl">{t("hero_title")}</h1>
      <p className="relief mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{t("hero_subtitle")}</p>
    </Unit>
  );
}

/* ─── Founder ─────────────────────────────────────────── */

export function AboutFounder() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <div>
          <h2 className="display text-2xl">{t("founder_name")}</h2>
          <p className="engraved mt-1">{t("founder_role")}</p>
        </div>
        <div className="sheet space-y-4 p-5 leading-relaxed sm:p-6">
          <p>{t("founder_p1")}</p>
          <p>{t("founder_p2")}</p>
          <p>{t("founder_p3")}</p>
          <p className="border-l-2 border-red pl-4 font-display text-lg italic">{t("founder_approach")}</p>
        </div>
      </div>
    </Unit>
  );
}

/* ─── Certifications ──────────────────────────────────── */

const certKeys = ["cka", "ccnp", "lpic", "nse", "juniper", "mikrotik"] as const;

export function AboutCertifications() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("certs_title")}</h2>
      <p className="relief mt-2 max-w-2xl text-ink-muted">{t("certs_subtitle")}</p>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {certKeys.map((key) => (
          <li key={key} className="raised p-4">
            <h3 className="display text-base leading-snug">{t(`cert_${key}_name`)}</h3>
            <p className="mt-1 font-mono text-[0.6875rem] text-ink-muted">{t(`cert_${key}_org`)}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(`cert_${key}_desc`)}</p>
          </li>
        ))}
      </ul>
    </Unit>
  );
}

/* ─── Process ─────────────────────────────────────────── */

const processSteps = ["s1", "s2", "s3", "s4"] as const;

export function AboutProcess() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("process_title")}</h2>
      <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {processSteps.map((step, index) => (
          <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span className="stamp" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3 className="display text-lg">{t(`process_${step}_title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`process_${step}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}

/* ─── Timeline ────────────────────────────────────────── */

const timelineEntries = [
  "moldtelecom", "orange", "saltedge",
  "gilat", "alexhost", "ebs", "duocircle", "mit",
] as const;

type TimelineKey = (typeof timelineEntries)[number];

/** Company sites worth linking from the timeline. */
const timelineLinks: Partial<Record<TimelineKey, string>> = { mit: "https://mitdev.md" };

export function AboutTimeline() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="label-red">{t("timeline_label")}</h2>
      <ol className="ledger mt-2">
        {timelineEntries.map((key) => (
          <li key={key} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <p className="font-mono text-xs text-ink-muted sm:pt-1">{t(`tl_${key}_date`)}</p>
            <div>
              <h3 className="display text-lg leading-snug">
                {timelineLinks[key] ? (
                  <a
                    href={timelineLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-red underline-offset-4"
                  >
                    {t(`tl_${key}_company`)}
                  </a>
                ) : (
                  t(`tl_${key}_company`)
                )}
              </h3>
              <p className="text-sm font-medium">{t(`tl_${key}_role`)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`tl_${key}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}

/* ─── Company ─────────────────────────────────────────── */

export function AboutCompany() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <h2 className="display text-2xl">{t("company_name")}</h2>
        <div className="sheet space-y-4 p-5 leading-relaxed sm:p-6">
          <p>{t("company_p1")}</p>
          <p>{t("company_p2")}</p>
          <p className="font-semibold text-red">{t("company_registered")}</p>
        </div>
      </div>
    </Unit>
  );
}

/* ─── Values ──────────────────────────────────────────── */

const values = ["1", "2", "3", "4"] as const;

export function AboutValues() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("values_title")}</h2>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {values.map((key) => (
          <li key={key} className="raised p-4">
            <h3 className="display text-lg leading-snug">{t(`value_${key}_title`)}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t(`value_${key}_desc`)}</p>
          </li>
        ))}
      </ul>
    </Unit>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */

export function AboutCTA() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="display text-2xl">{t("cta_title")}</h2>
          <p className="mt-1 max-w-xl text-ink-muted">{t("cta_desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/#contact" className="key-red">
            {t("cta_consult")}
          </Link>
          <Link href="/#services" className="key min-h-11 px-4 font-sans tracking-[0.12em]">
            {t("cta_services")}
          </Link>
        </div>
      </div>
    </Unit>
  );
}
