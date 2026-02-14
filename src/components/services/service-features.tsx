"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { getServiceBySlug } from "@/lib/services";

interface ServiceFeaturesProps {
  slug: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ServiceFeatures({ slug }: ServiceFeaturesProps) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  const features = [
    t(`${service.key}_f1`),
    t(`${service.key}_f2`),
    t(`${service.key}_f3`),
    t(`${service.key}_f4`),
  ];

  return (
    <section className="border-t border-border/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("features_label")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-8 grid gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div
              key={feature}
              variants={itemVariants}
              className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${service.gradient} shadow-md`}
                aria-hidden="true"
              >
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground pt-2">
                {feature}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
