"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

const stats = [
  { value: 12000, suffix: "+", label: "Shapes drawn" },
  { value: 98, suffix: "%", label: "Sync reliability" },
  { value: 40, suffix: "ms", label: "Median latency" },
  { value: 3, suffix: "", label: "Tools, zero clutter" },
];

function StatItem({ value, suffix, label }: (typeof stats)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span
        className="text-3xl text-[#14171B] dark:text-[#F3EFE6] sm:text-4xl"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {count.toLocaleString()}
        {suffix}
      </span>
      <span
        className="mt-1 text-xs text-[#14171B]/40 dark:text-[#F3EFE6]/40 sm:text-sm"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="relative border-y border-black/10 bg-black/[0.02] px-6 py-10 dark:border-white/10 dark:bg-white/[0.02] lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4"
      >
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </motion.div>
    </section>
  );
}