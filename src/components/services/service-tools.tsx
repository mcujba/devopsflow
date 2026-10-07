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
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("tools_label")}</h2>
      <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
        {tools.map((tool) => (
          <li key={tool} className="rounded-full border border-border px-3 py-1.5 text-muted-foreground">
            {tool}
          </li>
        ))}
      </ul>
    </section>
  );
}
