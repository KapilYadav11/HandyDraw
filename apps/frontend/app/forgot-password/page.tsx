"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { HTTP_BACKEND } from "@/config";
import { Logo } from "@/components/Logo";

const RESEND_COOLDOWN = 60;

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passwordChecks = useMemo(
    () => ({
      length: password.length > 8,
      capital: /^[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^a-zA-Z0-9]/.test(password),
    }),
    [password]
  );
  const passwordValid =
    passwordChecks.length &&
    passwordChecks.capital &&
    passwordChecks.number &&
    passwordChecks.symbol;
  const confirmValid = confirmPassword === password;

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function handleSendOtp() {
    setError("");
    if (!email.trim()) {
      setError("Enter your registered email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKEND}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      setNotice(res.data.message);
      setStep("otp");
      startCooldown();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKEND}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      setNotice(res.data.message);
      startCooldown();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/verify-reset-otp`, {
        email: email.trim().toLowerCase(),
        otp,
      });
      setStep("reset");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    if (!passwordValid) {
      setError("Password does not meet the requirements below.");
      return;
    }
    if (!confirmValid) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/reset-password`, {
        email: email.trim().toLowerCase(),
        otp,
        password,
      });
      setStep("done");
      setTimeout(() => router.push("/signin"), 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F3EFE6] px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {step === "email" && (
          <>
            <h2 className="mb-2 text-3xl text-[#1E2530]" style={{ fontFamily: "'Fraunces', serif" }}>
              Forgot password?
            </h2>
            <p className="mb-8 text-sm text-[#1E2530]/60" style={font}>
              Enter your registered email address and we'll send you a verification code.
            </p>

            <div className="flex flex-col gap-5" style={font}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
              />

              {error && <div className="text-sm text-[#C0392B]">{error}</div>}

              <button
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full rounded-full bg-[#1E2530] px-6 py-3 font-medium text-[#F3EFE6] transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <Link
                href="/signin"
                className="flex items-center justify-center gap-1 text-sm text-[#1E2530]/60 hover:text-[#1E2530]"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              onClick={() => setStep("email")}
              className="mb-6 flex items-center gap-1 text-sm text-[#1E2530]/60 hover:text-[#1E2530]"
              style={font}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="mb-2 text-3xl text-[#1E2530]" style={{ fontFamily: "'Fraunces', serif" }}>
              Enter verification code
            </h2>
            <p className="mb-8 text-sm text-[#1E2530]/60" style={font}>
              {notice || `We've sent a code to ${email}, if an account exists.`}
            </p>

            <div className="flex flex-col gap-5" style={font}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="w-full rounded-xl border-2 border-[#D8D2C4] bg-transparent px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
              />

              {error && <div className="text-sm text-[#C0392B]">{error}</div>}

              <button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-full rounded-full bg-[#1E2530] px-6 py-3 font-medium text-[#F3EFE6] transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>

              <button
                disabled={cooldown > 0 || loading}
                onClick={handleResendOtp}
                className="text-sm font-medium text-[#3B5BFF] disabled:text-[#1E2530]/30"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="mb-2 text-3xl text-[#1E2530]" style={{ fontFamily: "'Fraunces', serif" }}>
              Create new password
            </h2>
            <p className="mb-8 text-sm text-[#1E2530]/60" style={font}>
              Choose a new password for your account.
            </p>

            <div className="flex flex-col gap-5" style={font}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 pr-8 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-2.5 text-[#1E2530]/40 hover:text-[#1E2530]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {password.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1 text-xs">
                    <li className={`flex items-center gap-1.5 ${passwordChecks.capital ? "text-[#2E7D32]" : "text-[#1E2530]/40"}`}>
                      {passwordChecks.capital ? <Check size={13} /> : <X size={13} />} Starts with a capital letter
                    </li>
                    <li className={`flex items-center gap-1.5 ${passwordChecks.number ? "text-[#2E7D32]" : "text-[#1E2530]/40"}`}>
                      {passwordChecks.number ? <Check size={13} /> : <X size={13} />} Contains a number
                    </li>
                    <li className={`flex items-center gap-1.5 ${passwordChecks.symbol ? "text-[#2E7D32]" : "text-[#1E2530]/40"}`}>
                      {passwordChecks.symbol ? <Check size={13} /> : <X size={13} />} Contains a symbol
                    </li>
                    <li className={`flex items-center gap-1.5 ${passwordChecks.length ? "text-[#2E7D32]" : "text-[#1E2530]/40"}`}>
                      {passwordChecks.length ? <Check size={13} /> : <X size={13} />} More than 8 characters
                    </li>
                  </ul>
                )}
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b-2 border-[#D8D2C4] bg-transparent py-2 text-[#1E2530] outline-none transition-colors focus:border-[#3B5BFF]"
              />

              {error && <div className="text-sm text-[#C0392B]">{error}</div>}

              <button
                disabled={loading}
                onClick={handleResetPassword}
                className="w-full rounded-full bg-[#1E2530] px-6 py-3 font-medium text-[#F3EFE6] transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="text-center" style={font}>
            <h2 className="mb-2 text-3xl text-[#1E2530]" style={{ fontFamily: "'Fraunces', serif" }}>
              All set!
            </h2>
            <p className="text-sm text-[#1E2530]/60">
              Password reset successfully. Redirecting you to sign in...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}