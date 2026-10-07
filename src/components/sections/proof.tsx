import { useTranslations } from "next-intl";
import { CERTIFICATIONS, STATS } from "@/lib/site";

export function Proof() {
  const t = useTranslations("Stats");
  const tHome = useTranslations("Home");

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="sr-only">{tHome("proof_title")}</h2>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map(({ key, value }) => (
          <div key={key} className="card-surface flex flex-col-reverse p-5">
            <dt className="mt-1 text-sm text-muted-foreground">{t(`${key}_label`)}</dt>
            <dd className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-xs tracking-[0.1em] text-muted-foreground">
        {CERTIFICATIONS.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    </section>
  );
}
