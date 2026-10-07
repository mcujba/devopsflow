import { useTranslations } from "next-intl";

const STEPS = ["discovery", "architecture", "implementation", "support"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("label")}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step} className="card-surface p-5">
            <span aria-hidden="true" className="text-gradient font-mono text-sm font-bold">
              0{index + 1}
            </span>
            <h3 className="mt-3 font-bold">{t(`${step}_title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`${step}_desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
