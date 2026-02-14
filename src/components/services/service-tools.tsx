"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { getServiceBySlug } from "@/lib/services";

interface ServiceToolsProps {
  slug: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function ServiceTools({ slug }: ServiceToolsProps) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;
  const tools = t(`${service.key}_tools`).split(", ");

  return (
    <section className="border-t border-border/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2"
        >
          <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("tools_label")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {tools.map((tool) => (
            <motion.span
              key={tool}
              variants={pillVariants}
              className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${service.accentBg} text-foreground/80 border border-border/40`}
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
