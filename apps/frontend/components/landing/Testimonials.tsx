"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "We use it for every design review now — someone sketches an idea and the whole team is drawing on top of it within seconds.",
    name: "Priya Menon",
    role: "Product Designer",
  },
  {
    quote:
      "Replaced our whiteboard-on-a-video-call setup entirely. No more someone forgetting to share their screen.",
    name: "Arjun Verma",
    role: "Engineering Lead",
  },
  {
    quote:
      "Simple enough that I didn't need to explain it to the client before a call — they just started drawing.",
    name: "Sofia Ricci",
    role: "Freelance Consultant",
  },
  {
    quote:
      "The real-time sync is genuinely instant. I was expecting some lag, there wasn't any.",
    name: "Daniel Osei",
    role: "Frontend Developer",
  },
  {
    quote:
      "Our study group uses it to work through problems together — feels like sitting around one notebook.",
    name: "Meera Nair",
    role: "Student",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="w-[340px] shrink-0 rounded-3xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03] sm:w-[400px]">
      <p
        className="mb-6 text-[15px] leading-relaxed text-[#14171B]/80 dark:text-[#F3EFE6]/80"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-[#F3EFE6] dark:text-[#14171B]"
          style={{ backgroundColor: "#3B5BFF" }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm text-[#14171B] dark:text-[#F3EFE6]">{name}</p>
          <p className="text-xs text-[#14171B]/40 dark:text-[#F3EFE6]/40">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="relative overflow-hidden py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-14 max-w-2xl px-6 text-center"
      >
        <h2
          className="text-3xl text-[#14171B] dark:text-[#F3EFE6] sm:text-4xl"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Loved by people who draw
        </h2>
      </motion.div>

      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#F3EFE6] to-transparent dark:from-[#14171B]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#F3EFE6] to-transparent dark:from-[#14171B]" />

        <div className="flex gap-5 [animation:marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}