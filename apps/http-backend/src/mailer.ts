import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function wrapTemplate(title: string, bodyHtml: string): string {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F3EFE6; border-radius: 16px;">
    <p style="font-size: 20px; font-weight: 600; color: #14171B; margin: 0 0 24px;">Handydraw</p>
    <h2 style="font-size: 18px; color: #14171B; margin: 0 0 12px;">${title}</h2>
    ${bodyHtml}
    <p style="font-size: 12px; color: #14171B99; margin-top: 32px;">
      This is an automated message from Handydraw. Please do not reply to this email.
    </p>
  </div>`;
}

function otpBlock(otp: string): string {
  return `
    <div style="background: #14171B; color: #F3EFE6; font-size: 32px; font-weight: 600; letter-spacing: 8px; text-align: center; padding: 16px; border-radius: 12px; margin: 20px 0;">
      ${otp}
    </div>
    <p style="font-size: 13px; color: #14171B99; margin: 0;">
      This code expires in 5 minutes. Do not share it with anyone.
    </p>`;
}

export async function sendSignupOtpEmail(to: string, otp: string) {
  const html = wrapTemplate(
    "Verify your email address",
    `<p style="font-size: 14px; color: #14171B; margin: 0 0 8px;">
      Use the code below to verify your email and finish creating your account.
    </p>${otpBlock(otp)}`
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email address",
    html,
  });
}

export async function sendResetOtpEmail(to: string, otp: string) {
  const html = wrapTemplate(
    "Password reset verification code",
    `<p style="font-size: 14px; color: #14171B; margin: 0 0 8px;">
      Use the code below to reset your password.
    </p>${otpBlock(otp)}
    <p style="font-size: 13px; color: #14171B99; margin-top: 16px;">
      If you did not request a password reset, you can safely ignore this email.
    </p>`
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Password Reset Verification Code",
    html,
  });
}