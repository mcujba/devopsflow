import { useTranslations } from "next-intl";
import { getServiceBySlug } from "@/lib/services";

const FEATURES = ["f1", "f2", "f3", "f4"] as const;

export function ServiceFeatures({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <div className="mt-8">
      <h2 className="label-red">{t("features_label")}</h2>
      <ul className="ledger mt-2 grid gap-x-8 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex gap-3 py-2.5 text-sm">
            <span className="led led-on mt-1.5" aria-hidden="true" />
            {t(`${service.key}_${feature}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
