import { useTranslations } from "next-intl";
import { Unit } from "@/components/rack/unit";

const STEPS = ["discovery", "architecture", "implementation", "support"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <Unit id="process" labelledBy="process-title">
      <p className="label-red">{t("label")}</p>
      <h2 id="process-title" className="display mt-1 text-2xl sm:text-3xl">
        {t("title")}
      </h2>
      <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span className="stamp" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3 className="display text-lg">{t(`${step}_title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`${step}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}
