import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#14171B]">
      <Navbar />
      <div id="demo">
        <Hero />
      </div>
      <BentoGrid />
      <Testimonials />

      <footer className="relative border-t border-white/10 px-6 py-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p
            className="text-sm text-[#F3EFE6]/40"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Handydraw — a shared canvas, in real time.
          </p>
          <Link
            href="/signup"
            className="text-sm font-medium text-[#F3EFE6] hover:underline"
          >
            Get started free
          </Link>
        </div>
      </footer>
    </main>
  );
}