"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Logo } from "../Logo";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Live demo", href: "#demo" },
      { label: "Features", href: "#features" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Source code", href: "https://github.com" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com" },
  { icon: MessageCircle, label: "Discord", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <footer className="relative border-t border-black/10 bg-black/[0.02] px-6 pt-16 pb-8 dark:border-white/10 dark:bg-[#0F1114] lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2" style={font}>
            <Logo theme="auto" />
            <p className="mt-4 max-w-xs text-sm text-[#14171B]/50 dark:text-[#F3EFE6]/50">
              A shared canvas for sketching, diagramming, and thinking out
              loud — together, in real time.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-[#14171B]/70 dark:border-white/10 dark:bg-white/5 dark:text-[#F3EFE6]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              All systems operational
            </div>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#14171B]/60 transition-colors hover:border-black/30 hover:text-[#14171B] dark:border-white/10 dark:text-[#F3EFE6]/60 dark:hover:border-white/30 dark:hover:text-[#F3EFE6]"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} style={font}>
              <h4 className="mb-3 text-sm font-medium text-[#14171B] dark:text-[#F3EFE6]">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#14171B]/50 transition-colors hover:text-[#14171B] dark:text-[#F3EFE6]/50 dark:hover:text-[#F3EFE6]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center"
          style={font}
        >
          <div>
            <p className="text-sm font-medium text-[#14171B] dark:text-[#F3EFE6]">
              Get notified about new features
            </p>
            <p className="text-xs text-[#14171B]/40 dark:text-[#F3EFE6]/40">
              No spam, just the occasional update.
            </p>
          </div>

          {subscribed ? (
            <p className="text-sm text-[#2E7D32] dark:text-[#7EE0A8]">
              Thanks — you're on the list.
            </p>
          ) : (
            <div className="flex w-full gap-2 sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-black/15 bg-transparent px-4 py-2 text-sm text-[#14171B] outline-none placeholder:text-[#14171B]/30 focus:border-[#3B5BFF] dark:border-white/15 dark:text-[#F3EFE6] dark:placeholder:text-[#F3EFE6]/30 sm:w-56"
              />
              <button
                onClick={handleSubscribe}
                className="flex shrink-0 items-center gap-1 rounded-full bg-[#14171B] px-4 py-2 text-sm font-medium text-[#F3EFE6] transition-transform hover:scale-105 active:scale-95 dark:bg-[#F3EFE6] dark:text-[#14171B]"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row"
          style={font}
        >
          <p className="text-xs text-[#14171B]/40 dark:text-[#F3EFE6]/40">
            © {new Date().getFullYear()} Handydraw. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-[#14171B]/40 hover:text-[#14171B]/70 dark:text-[#F3EFE6]/40 dark:hover:text-[#F3EFE6]/70">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-[#14171B]/40 hover:text-[#14171B]/70 dark:text-[#F3EFE6]/40 dark:hover:text-[#F3EFE6]/70">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
