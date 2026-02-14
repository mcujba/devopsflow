"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getRelatedServices } from "@/lib/services";

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

interface RelatedServicesProps {
  currentSlug: string;
}

export function RelatedServices({ currentSlug }: RelatedServicesProps) {
  const t = useTranslations("ServicesPage");
  const tNav = useTranslations("Services");
  const related = getRelatedServices(currentSlug);

  return (
    <section className="border-t border-border/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold uppercase tracking-wider text-primary"
        >
          {t("related_services")}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-8 grid gap-6 sm:grid-cols-3"
        >
          {related.map((service) => {
            const Icon = service.icon;
            const title = t(`${service.key}_title`);
            return (
              <motion.div key={service.key} variants={itemVariants}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full"
                  aria-label={title}
                >
                  <div className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />

                    <div className="relative">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${service.gradient} shadow-lg`}
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {t(`${service.key}_desc`)}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {tNav("learn_more")}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
