import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F3EFE6] transition-colors duration-300 dark:bg-[#14171B]">
      <Navbar />
      <div id="demo">
        <Hero />
      </div>
      <StatsStrip />
      <BentoGrid />
      <Testimonials />
      <Footer />
    </main>
  );
}