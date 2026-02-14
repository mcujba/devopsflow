"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatConfig {
  key: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const stats: StatConfig[] = [
  { key: "experience", value: 10, suffix: "+", prefix: "" },
  { key: "requests", value: 10, suffix: "M+", prefix: "" },
  { key: "deploys", value: 60, suffix: "%", prefix: "" },
  { key: "uptime", value: 99.9, suffix: "%", prefix: "" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function AnimatedCounter({
  value,
  suffix,
  prefix = "",
  inView,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((eased * value).toFixed(isDecimal ? 1 : 0)));

      if (current >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value, isDecimal]);

  return (
    <span className="tabular-nums">
      {prefix}
      {isDecimal ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const t = useTranslations("Stats");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-t border-border/40 bg-card/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.key}
              variants={statItem}
              className="text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  inView={inView}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">
                {t(`${stat.key}_label`)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t(`${stat.key}_desc`)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
