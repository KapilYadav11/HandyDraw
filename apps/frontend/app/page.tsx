import Link from "next/link";
import { SketchArt } from "@/components/SketchArt";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#14171B]">
      {/* faint graph-paper grid, ties to the canvas metaphor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#F3EFE6 1px, transparent 1px), linear-gradient(90deg, #F3EFE6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <header className="relative flex items-center justify-between px-6 py-6 lg:px-16 lg:py-8">
                <Logo />
        <Link
          href="/signin"
          className="text-sm text-[#F3EFE6]/70 transition-colors hover:text-[#F3EFE6]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Sign in
        </Link>
      </header>

      <section className="relative flex flex-1 flex-col-reverse items-center justify-center gap-12 px-6 py-12 lg:flex-row lg:justify-between lg:px-16 lg:py-0">
        <div
          className="max-w-lg text-center lg:text-left"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <p
            className="mb-3 inline-block -rotate-3 text-2xl text-[#FFB020] lg:text-3xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            sketch it out, together
          </p>

          <h1
            className="mb-6 text-4xl leading-tight text-[#F3EFE6] lg:text-5xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Draw together,
            <br />
            in real time.
          </h1>

          <p className="mb-9 text-base text-[#F3EFE6]/60 lg:text-lg">
            Open a room, share it, and start sketching. Everyone in the room
            sees every line the moment it's drawn.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/signup"
              className="group relative w-full overflow-hidden rounded-full bg-[#F3EFE6] px-7 py-3 text-center text-[#14171B] transition-transform active:scale-[0.98] sm:w-auto"
            >
              <span className="relative z-10 font-medium">
                Create an account
              </span>
              <svg
                className="pointer-events-none absolute inset-x-6 bottom-2 h-2 w-[calc(100%-3rem)]"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 5c30-6 60 4 96-2s70 6 100-1"
                  stroke="#3B5BFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="[stroke-dasharray:260] [stroke-dashoffset:260] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
                />
              </svg>
            </Link>

            <Link
              href="/signin"
              className="w-full rounded-full border-2 border-[#F3EFE6]/30 px-7 py-3 text-center font-medium text-[#F3EFE6] transition-colors hover:border-[#F3EFE6]/70 sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>

        <SketchArt className="h-48 w-48 shrink-0 text-[#F3EFE6]/70 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />
      </section>
    </main>
  );
}