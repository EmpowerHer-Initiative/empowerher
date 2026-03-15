"use client";

import { motionInView } from "@/lib/utils";
import { motion } from "motion/react";

export const Trust = () => {
  return (
    <motion.div
      className="container mx-auto max-w-6xl px-4"
      variants={motionInView}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <p className="text-muted-foreground mb-8 text-center text-sm font-medium tracking-wider uppercase">
        Trusted by teams at
      </p>
      <div className="text-muted-foreground/50 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind."].map(
          (company) => (
            <span key={company} className="text-lg font-bold tracking-wide">
              {company}
            </span>
          )
        )}
      </div>
    </motion.div>
  );
};
