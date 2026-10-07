import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { getServiceBySlug } from "@/lib/services";

const FEATURES = ["f1", "f2", "f3", "f4"] as const;

export function ServiceFeatures({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("features_label")}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="card-surface flex gap-3 p-4 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {t(`${service.key}_${feature}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
