"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Wrench } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ServiceDefinition } from "@/lib/services";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ServiceCardProps {
  service: ServiceDefinition;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const t = useTranslations("ServicesPage");
  const Icon = service.icon;
  const title = t(`${service.key}_title`);
  const features = [
    t(`${service.key}_f1`),
    t(`${service.key}_f2`),
    t(`${service.key}_f3`),
    t(`${service.key}_f4`),
  ];
  const tools = t(`${service.key}_tools`).split(", ");

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/services/${service.slug}`}
        className="group block h-full"
        aria-label={title}
      >
        <div className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg`}
              >
                <Icon className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${service.key}_desc`)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("features_label")}
              </span>
              <ul className="mt-3 space-y-2.5">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-border/40 pt-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                {t("tools_label")}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${service.accentBg} text-foreground/80`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
