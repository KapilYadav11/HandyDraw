"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "../Logo";
import { initTheme, applyTheme, type Theme } from "@/lib/theme";

const sections = [
  { id: "demo", label: "Demo" },
  { id: "features", label: "Features" },
  { id: "testimonials", label: "Loved by" },
];

export function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(initTheme());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

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
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 ${
          scrolled ? "pt-3" : "pt-6"
        }`}
      >
        <nav
          className={`flex w-[92%] max-w-3xl items-center justify-between rounded-full border border-black/10 bg-white/70 px-4 py-2.5 backdrop-blur-xl transition-shadow dark:border-white/10 dark:bg-white/5 ${
            scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Logo className="scale-90" theme="auto" />
            <span
              className="hidden rounded-full border border-black/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#14171B]/60 dark:border-white/15 dark:text-[#F3EFE6]/60 sm:inline-block"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              v1.0 Beta
            </span>
          </div>

          <div className="hidden items-center gap-1 rounded-full bg-black/5 p-1 dark:bg-black/20 sm:flex">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="relative px-3.5 py-1.5 text-sm text-[#14171B]/70 transition-colors hover:text-[#14171B] dark:text-[#F3EFE6]/70 dark:hover:text-[#F3EFE6]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#14171B]/60 transition-colors hover:text-[#14171B] dark:text-[#F3EFE6]/60 dark:hover:text-[#F3EFE6]"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              href="/signin"
              className="text-sm text-[#14171B]/70 transition-colors hover:text-[#14171B] dark:text-[#F3EFE6]/70 dark:hover:text-[#F3EFE6]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#14171B] px-4 py-1.5 text-sm font-medium text-[#F3EFE6] transition-transform hover:scale-105 active:scale-95 dark:bg-[#F3EFE6] dark:text-[#14171B]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Get started
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center text-[#14171B] dark:text-[#F3EFE6]"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-8 w-8 items-center justify-center text-[#14171B] dark:text-[#F3EFE6]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/98 backdrop-blur-lg dark:bg-[#14171B]/98 sm:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <Logo theme="auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center text-[#14171B] dark:text-[#F3EFE6]"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-6 px-6 pt-10"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="text-2xl text-[#14171B]/80 dark:text-[#F3EFE6]/80"
                >
                  {s.label}
                </button>
              ))}
              <div className="mt-6 flex w-full flex-col gap-3">
                <Link
                  href="/signin"
                  className="w-full rounded-full border border-black/15 py-3 text-center text-[#14171B] dark:border-white/15 dark:text-[#F3EFE6]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="w-full rounded-full bg-[#14171B] py-3 text-center font-medium text-[#F3EFE6] dark:bg-[#F3EFE6] dark:text-[#14171B]"
                >
                  Get started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}