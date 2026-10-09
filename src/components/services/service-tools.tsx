import { useTranslations } from "next-intl";
import { getServiceBySlug } from "@/lib/services";

export function ServiceTools({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;
  const tools = t(`${service.key}_tools`)
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);

  return (
    <div className="mt-8">
      <h2 className="label-red">{t("tools_label")}</h2>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {tools.map((tool) => (
          <li key={tool} className="tag">
            {tool}
          </li>
        ))}
      </ul>
    </div>
  );
}
