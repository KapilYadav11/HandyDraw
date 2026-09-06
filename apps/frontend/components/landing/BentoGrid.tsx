"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Shapes, Gauge } from "lucide-react";

function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !ref.current) return;
    ref.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx) var(--my), rgba(59,91,255,0.18), transparent 70%)",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

function useCountUp(target: number, active: boolean, duration = 1200) {
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

function CodePreviewCard() {
  const [tab, setTab] = useState<"payload" | "broadcast">("payload");
  const font = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <GlowCard className="p-6 sm:col-span-2 sm:row-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-lg text-[#F3EFE6]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Every line, broadcast instantly
        </h3>
        <div className="flex gap-1 rounded-full bg-black/30 p-1 text-xs">
          {(["payload", "broadcast"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 transition-colors ${
                tab === t
                  ? "bg-white/10 text-[#F3EFE6]"
                  : "text-[#F3EFE6]/40 hover:text-[#F3EFE6]/70"
              }`}
            >
              {t === "payload" ? "Payload" : "Server"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-[#0F1114] p-4 text-[13px] leading-relaxed" style={font}>
        {tab === "payload" ? (
          <pre className="whitespace-pre-wrap">
            <span className="text-[#F3EFE6]/40">{"{"}</span>
            {"\n  "}
            <span className="text-[#8AA0FF]">"type"</span>
            <span className="text-[#F3EFE6]/40">: </span>
            <span className="text-[#7EE0A8]">"chat"</span>
            <span className="text-[#F3EFE6]/40">,</span>
            {"\n  "}
            <span className="text-[#8AA0FF]">"roomId"</span>
            <span className="text-[#F3EFE6]/40">: </span>
            <span className="text-[#7EE0A8]">"482"</span>
            <span className="text-[#F3EFE6]/40">,</span>
            {"\n  "}
            <span className="text-[#8AA0FF]">"message"</span>
            <span className="text-[#F3EFE6]/40">: </span>
            <span className="text-[#7EE0A8]">
              "{"{"}\"shape\":{"{"}...{"}"}{"}"}"
            </span>
            {"\n"}
            <span className="text-[#F3EFE6]/40">{"}"}</span>
          </pre>
        ) : (
          <pre className="whitespace-pre-wrap">
            <span className="text-[#C792EA]">users</span>
            <span className="text-[#F3EFE6]/40">.forEach(</span>
            <span className="text-[#F3EFE6]/70">user</span>
            <span className="text-[#F3EFE6]/40">{" => {"}</span>
            {"\n  "}
            <span className="text-[#C792EA]">if</span>
            <span className="text-[#F3EFE6]/40">(</span>
            <span className="text-[#F3EFE6]/70">user</span>
            <span className="text-[#F3EFE6]/40">.rooms.includes(</span>
            <span className="text-[#F3EFE6]/70">roomId</span>
            <span className="text-[#F3EFE6]/40">)) {"{"}</span>
            {"\n    "}
            <span className="text-[#F3EFE6]/70">user</span>
            <span className="text-[#F3EFE6]/40">.ws.send(</span>
            <span className="text-[#F3EFE6]/70">payload</span>
            <span className="text-[#F3EFE6]/40">)</span>
            {"\n  "}
            <span className="text-[#F3EFE6]/40">{"}"}</span>
            {"\n"}
            <span className="text-[#F3EFE6]/40">{"});"}</span>
          </pre>
        )}
      </div>
      <p className="mt-4 text-sm text-[#F3EFE6]/50">
        Shapes are sent over WebSocket the instant you draw them, and pushed
        to everyone else already in the room.
      </p>
    </GlowCard>
  );
}

function BrushSizeCard() {
  const [size, setSize] = useState(6);

  return (
    <GlowCard className="p-6">
      <h3
        className="mb-1 text-base text-[#F3EFE6]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Your stroke, your call
      </h3>
      <p className="mb-6 text-sm text-[#F3EFE6]/50">
        Pencil, rectangle, or circle — adjust and draw your way.
      </p>

      <div className="flex flex-1 items-center justify-center rounded-2xl bg-[#0F1114] py-8">
        <div
          className="rounded-full bg-[#3B5BFF] transition-all duration-150"
          style={{ width: size * 2, height: size * 2 }}
        />
      </div>

      <input
        type="range"
        min={3}
        max={16}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className="mt-5 w-full accent-[#3B5BFF]"
      />
    </GlowCard>
  );
}

function SyncGaugeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const pct = useCountUp(98, inView);
  const circumference = 2 * Math.PI * 42;

  return (
    <GlowCard className="p-6">
      <div ref={ref} className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#7EE0A8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: inView
                  ? circumference * (1 - pct / 100)
                  : circumference,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl text-[#F3EFE6]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {pct}%
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#F3EFE6]/50">
          of strokes appear for teammates in under 100ms
        </p>
      </div>
    </GlowCard>
  );
}

function SmallFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <GlowCard className="p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#F3EFE6]/80">
        {icon}
      </div>
      <h3
        className="mb-1 text-base text-[#F3EFE6]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[#F3EFE6]/50">{description}</p>
    </GlowCard>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function BentoGrid() {
  return (
    <section id="features" className="relative px-6 py-28 lg:px-16">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2
          className="text-3xl text-[#F3EFE6] sm:text-4xl"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Built for drawing together
        </h2>
        <p className="mt-3 text-[#F3EFE6]/50">
          No file exports, no refreshing — just a shared canvas that stays in
          sync.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
      >
        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
          <CodePreviewCard />
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <BrushSizeCard />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SyncGaugeCard />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SmallFeatureCard
            icon={<Users size={18} />}
            title="Unlimited rooms"
            description="Spin up as many shared boards as you need, each with its own link."
          />
        </motion.div>
      </motion.div>
    </section>
  );
}