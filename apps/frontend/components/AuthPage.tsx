"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { SketchArt } from "./SketchArt";
import { Logo } from "./Logo";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (isSignin) {
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        await axios.post(`${HTTP_BACKEND}/signup`, {
          username: email,
          password,
          name,
        });
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#F3EFE6]">
      {/* Left: animated canvas panel */}
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#14171B] lg:h-auto lg:w-[58%]">
        {/* faint graph-paper grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#F3EFE6 1px, transparent 1px), linear-gradient(90deg, #F3EFE6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* soft accent glow */}
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: isSignin ? "#3B5BFF" : "#FFB020",
          }}
        />

        <Logo className="absolute left-8 top-8 lg:left-16 lg:top-10" />

        <SketchArt
          variant={isSignin ? "signin" : "signup"}
          className="relative h-40 w-40 text-[#F3EFE6]/80 lg:h-72 lg:w-72"
        />

        <p
          className="absolute bottom-8 left-8 -rotate-3 text-xl text-[#FFB020] lg:bottom-10 lg:left-16 lg:text-3xl"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {isSignin ? "good to see you again" : "sketch it out, together"}
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-20">
        <div className="w-full max-w-sm">
          <h2
            className="mb-2 text-4xl text-[#1E2530]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {isSignin ? "Welcome back" : "Start sketching"}
          </h2>
          <p
            className="mb-8 text-sm text-[#1E2530]/60"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {isSignin
              ? "Sign in to jump back into your rooms."
              : "Create an account to start drawing with others."}
          </p>

          <div
            className="flex flex-col gap-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {!isSignin && (
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
                />
                <label
                  htmlFor="name"
                  className="pointer-events-none absolute left-0 top-2 text-base text-[#1E2530]/40 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#3B5BFF] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#1E2530]/50"
                >
                  Name
                </label>
              </div>
            )}

            <div className="relative">
              <input
                id="email"
                type="text"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute left-0 top-2 text-base text-[#1E2530]/40 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#3B5BFF] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#1E2530]/50"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute left-0 top-2 text-base text-[#1E2530]/40 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#3B5BFF] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#1E2530]/50"
              >
                Password
              </label>
            </div>

            {error && <div className="text-sm text-[#C0392B]">{error}</div>}

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="group relative mt-2 w-full overflow-hidden rounded-full bg-[#1E2530] px-6 py-3 text-[#F3EFE6] transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 font-medium">
                {loading
                  ? "Please wait..."
                  : isSignin
                  ? "Sign in"
                  : "Create account"}
              </span>
              <svg
                className="pointer-events-none absolute inset-x-6 bottom-2 h-2 w-[calc(100%-3rem)]"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 5c30-6 60 4 96-2s70 6 100-1"
                  stroke="#FFB020"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="[stroke-dasharray:260] [stroke-dashoffset:260] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
                />
              </svg>
            </button>

            <p className="text-center text-sm text-[#1E2530]/60">
              {isSignin ? (
                <>
                  New here?{" "}
                  <Link href="/signup" className="font-medium text-[#3B5BFF]">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already sketching with us?{" "}
                  <Link href="/signin" className="font-medium text-[#3B5BFF]">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}