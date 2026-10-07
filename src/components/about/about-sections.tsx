import { useTranslations } from "next-intl";
import {
  Building2,
  User,
  Award,
  Search,
  PenTool,
  Rocket,
  Headphones,
  Heart,
  Shield,
  MessageSquare,
  Eye,
  ArrowRight,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

/* ─── Hero ────────────────────────────────────────────── */

export function AboutHero() {
  const t = useTranslations("AboutPage");

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            {t("hero_subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Company ─────────────────────────────────────────── */

export function AboutCompany() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold">{t("company_name")}</h2>
            </div>
          </div>

          <div
            className="space-y-4 lg:col-span-3"
          >
            <p className="text-muted-foreground leading-relaxed">
              {t("company_p1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("company_p2")}
            </p>
            <p className="font-medium text-primary">
              {t("company_registered")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Founder ─────────────────────────────────────────── */

export function AboutFounder() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 bg-card/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("founder_name")}</h2>
                <p className="text-sm text-muted-foreground">{t("founder_role")}</p>
              </div>
            </div>
          </div>

          <div
            className="space-y-4 lg:col-span-3"
          >
            <p className="text-muted-foreground leading-relaxed">
              {t("founder_p1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("founder_p2")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("founder_p3")}
            </p>
            <p className="border-l-2 border-primary pl-4 font-medium italic">
              {t("founder_approach")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Timeline ────────────────────────────────────────── */

const timelineEntries = [
  "moldtelecom", "orange", "saltedge",
  "gilat", "alexhost", "ebs", "duocircle", "skynet",
] as const;

export function AboutTimeline() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("timeline_label")}
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-border/60 sm:block lg:left-1/2 lg:-translate-x-px" />

          <div className="space-y-8 sm:space-y-12">
            {timelineEntries.map((key, i) => (
              <div
                key={key}
                className={`relative grid gap-4 sm:grid-cols-[1fr] sm:pl-12 lg:grid-cols-2 lg:gap-12 lg:pl-0 ${
                  i % 2 === 0 ? "" : "lg:direction-rtl"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background sm:block lg:left-1/2" />

                {/* Content — alternate sides on desktop */}
                <div className={`${i % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:col-start-2 lg:pl-12"}`}>
                  <div className="flex items-center gap-2 text-sm text-primary lg:justify-start">
                    <Calendar className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                    {t(`tl_${key}_date` as Parameters<typeof t>[0])}
                  </div>
                  <h3 className="mt-1 flex items-center gap-2 text-lg font-bold">
                    <Briefcase className="h-4 w-4 text-muted-foreground lg:hidden" aria-hidden="true" />
                    {t(`tl_${key}_company` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(`tl_${key}_role` as Parameters<typeof t>[0])}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`tl_${key}_desc` as Parameters<typeof t>[0])}
                  </p>
                </div>

                {/* Empty column for alternating layout */}
                {i % 2 === 0 && <div className="hidden lg:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Certifications (detailed) ───────────────────────── */

const certKeys = ["cka", "ccnp", "lpic", "nse", "juniper", "mikrotik"] as const;
export function AboutCertifications() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 bg-card/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("certs_title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("certs_subtitle")}</p>
        </div>

        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certKeys.map((key) => (
            <div
              key={key}
              className="rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-solid flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Award className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {t(`cert_${key}_name` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(`cert_${key}_org` as Parameters<typeof t>[0])}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`cert_${key}_desc` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─────────────────────────────────────────── */

const processSteps = [
  { key: "s1", icon: Search, step: "01" },
  { key: "s2", icon: PenTool, step: "02" },
  { key: "s3", icon: Rocket, step: "03" },
  { key: "s4", icon: Headphones, step: "04" },
] as const;

export function AboutProcess() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("process_title")}
          </h2>
        </div>

        <div
          className="grid gap-8 sm:grid-cols-2"
        >
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className="relative rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary/30 bg-card">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-primary">{step.step}</span>
                  <h3 className="text-lg font-semibold">
                    {t(`process_${step.key}_title` as Parameters<typeof t>[0])}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`process_${step.key}_desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Values ──────────────────────────────────────────── */

const values = [
  { key: "1", icon: Heart },
  { key: "2", icon: Shield },
  { key: "3", icon: MessageSquare },
  { key: "4", icon: Eye },
] as const;

export function AboutValues() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 bg-card/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("values_title")}
          </h2>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-2"
        >
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.key}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t(`value_${v.key}_title` as Parameters<typeof t>[0])}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`value_${v.key}_desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */

export function AboutCTA() {
  const t = useTranslations("AboutPage");

  return (
    <section className="border-t border-border/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("cta_title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("cta_desc")}
          </p>
          <div
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link href="/#contact" className="btn-primary">
              {t("cta_consult")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/#services" className="btn-ghost">
              {t("cta_services")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
