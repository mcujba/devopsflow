"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const certifications = [
  { name: "CKA", org: "CNCF", color: "from-blue-500 to-cyan-500" },
  { name: "CCNP", org: "Cisco", color: "from-cyan-500 to-teal-500" },
  { name: "CCNA", org: "Cisco", color: "from-teal-500 to-emerald-500" },
  { name: "LPIC-1", org: "LPI", color: "from-amber-500 to-orange-500" },
  { name: "NSE-5", org: "Fortinet", color: "from-red-500 to-rose-500" },
  { name: "NSE-4", org: "Fortinet", color: "from-rose-500 to-pink-500" },
  { name: "JNCIS-ENT", org: "Juniper", color: "from-violet-500 to-purple-500" },
  { name: "JNCIA", org: "Juniper", color: "from-purple-500 to-indigo-500" },
  { name: "MTCNA", org: "MikroTik", color: "from-indigo-500 to-blue-500" },
  { name: "MTCWE", org: "MikroTik", color: "from-sky-500 to-blue-500" },
];

export function CertificationsSection() {
  const t = useTranslations("Certifications");

  return (
    <section className="border-t border-border/40 bg-card/50 py-20 sm:py-28">
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

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {certifications.map((cert, i) => {
            // Wave pattern: items closer to center appear first
            const center = (certifications.length - 1) / 2;
            const waveDelay = Math.abs(i - center) * 0.08;

            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: waveDelay,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-3 transition-colors hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${cert.color} shadow`}
                >
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold">{cert.name}</div>
                  <div className="text-xs text-muted-foreground">{cert.org}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
