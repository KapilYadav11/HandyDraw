import crypto from "crypto";
import bcrypt from "bcrypt";

export const OTP_EXPIRY_MINUTES = 5;
export const MAX_OTP_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;

export function generateOtp(): string {
  // cryptographically secure 6-digit OTP, e.g. "000452" (zero-padded)
  const num = crypto.randomInt(0, 1000000);
  return num.toString().padStart(6, "0");
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtpHash(
  otp: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}