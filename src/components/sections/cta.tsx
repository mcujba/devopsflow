"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, MessageSquare, Send } from "lucide-react";

const formContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const formField = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function CTASection() {
  const t = useTranslations("CTA");

  return (
    <section className="relative border-t border-border/40 py-20 sm:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — CTA copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold uppercase tracking-wider text-primary"
            >
              {t("label")}
            </motion.span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("description")}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  {t("cta_email")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("cta_schedule")}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — Form preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-xl shadow-primary/5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mb-5 flex items-center gap-2"
              >
                <Send className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t("form_title")}</h3>
              </motion.div>
              <motion.div
                variants={formContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                <motion.div variants={formField}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("form_name")}
                  </label>
                  <div className="h-10 rounded-lg border border-border/60 bg-muted/30" />
                </motion.div>
                <motion.div variants={formField}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("form_email")}
                  </label>
                  <div className="h-10 rounded-lg border border-border/60 bg-muted/30" />
                </motion.div>
                <motion.div variants={formField}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("form_message")}
                  </label>
                  <div className="h-24 rounded-lg border border-border/60 bg-muted/30" />
                </motion.div>
                <motion.div variants={formField}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link href="/contact">
                      {t("form_submit")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
