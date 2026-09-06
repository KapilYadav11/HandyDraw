"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "../Logo";

const sections = [
  { id: "demo", label: "Demo" },
  { id: "features", label: "Features" },
  { id: "testimonials", label: "Loved by" },
];

export function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 ${
        scrolled ? "pt-3" : "pt-6"
      }`}
    >
      <nav
        className={`flex w-[92%] max-w-3xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl transition-shadow ${
          scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <Logo className="scale-90" />

        <div className="hidden items-center gap-1 rounded-full bg-black/20 p-1 sm:flex">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="relative px-3.5 py-1.5 text-sm text-[#F3EFE6]/70 transition-colors hover:text-[#F3EFE6]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="hidden text-sm text-[#F3EFE6]/70 transition-colors hover:text-[#F3EFE6] sm:block"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#F3EFE6] px-4 py-1.5 text-sm font-medium text-[#14171B] transition-transform hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Get started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}