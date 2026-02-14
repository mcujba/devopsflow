"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, PenTool, Rocket, Headphones } from "lucide-react";

const steps = [
  { key: "discovery", icon: Search, step: "01" },
  { key: "architecture", icon: PenTool, step: "02" },
  { key: "implementation", icon: Rocket, step: "03" },
  { key: "support", icon: Headphones, step: "04" },
] as const;

const stepCard = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const iconSpin = {
  hidden: { scale: 0, rotate: -90 },
  show: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.15 + 0.1,
      type: "spring" as const,
      stiffness: 200,
      damping: 12,
    },
  }),
};

const badge = {
  hidden: { scale: 0 },
  show: (i: number) => ({
    scale: 1,
    transition: {
      delay: i * 0.15 + 0.2,
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
    },
  }),
};

export function ProcessSection() {
  const t = useTranslations("Process");
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.6"],
  });

  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative border-t border-border/40 py-20 sm:py-28">
      <div className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/3 blur-[120px]" />

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

        <div ref={timelineRef} className="relative mt-16">
          {/* Connector line (desktop) — scroll-driven */}
          <div className="absolute left-0 right-0 top-16 hidden h-px lg:block">
            {/* Track */}
            <div className="absolute inset-0 bg-border/40" />
            {/* Progress fill */}
            <motion.div
              style={{ scaleX: lineScaleX, transformOrigin: "left" }}
              className="absolute inset-0 bg-gradient-to-r from-primary via-cyan to-primary"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  custom={i}
                  variants={stepCard}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {/* Step circle */}
                  <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center">
                    <div className="relative">
                      <motion.div
                        custom={i}
                        variants={iconSpin}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/30 bg-card transition-colors hover:border-primary/60"
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <motion.span
                        custom={i}
                        variants={badge}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                      >
                        {step.step}
                      </motion.span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">{t(`${step.key}_title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${step.key}_desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
