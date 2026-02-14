"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";

const previewServices = services.slice(0, 4);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const iconBounce = {
  hidden: { scale: 0, rotate: -30 },
  show: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 15,
      delay: 0.2,
    },
  },
};

export function ServicesPreview() {
  const t = useTranslations("Services");

  return (
    <section className="relative border-t border-border/40 py-20 sm:py-28">
      <div className="absolute right-0 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/3 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("label")}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {previewServices.map((service) => {
            const Icon = service.icon;
            const title = t(service.key);
            return (
              <motion.div key={service.key} variants={item}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full"
                  aria-label={title}
                >
                  <div className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />

                    <div className="relative">
                      <motion.div
                        variants={iconBounce}
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${service.gradient} shadow-lg`}
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <h3 className="mt-5 text-base font-semibold">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t(`${service.key}_desc`)}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {t("learn_more")}
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
