"use client";

import { motion } from "motion/react";

import { motionInView } from "@/lib/utils";

export const Results = () => {
  return (
    <section
      id="results"
      className="bg-primary text-primary-foreground scroll-mt-24 py-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "50M+", label: "Requests/Day" },
            { value: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={motionInView}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, amount: 1 }}
            >
              <div className="mb-2 text-3xl font-bold md:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="text-primary-foreground/70 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
