"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/services";
import { ServiceCard } from "@/components/services/service-card";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function ServicesGrid() {
  return (
    <section className="relative border-t border-border/40 py-16 sm:py-20">
      <div className="absolute left-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-primary/3 blur-[150px]" />
      <div className="absolute right-0 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-cyan/3 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {services.map((service) => (
            <ServiceCard key={service.key} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
