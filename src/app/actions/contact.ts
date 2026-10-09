"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(2, "validation_name_min").max(100, "validation_name_max"),
  email: z.string().email("validation_email_invalid"),
  message: z
    .string()
    .min(10, "validation_message_min")
    .max(5000, "validation_message_max"),
  turnstileToken: z.string().min(1, "validation_captcha_required"),
});

// Cloudflare cuts a request off after 100 seconds, and the mail library waits up
// to two minutes for a dead server by default. Without these limits a blocked
// SMTP port leaves the form on "Sending…" until the page errors out.
const CAPTCHA_TIMEOUT_MS = 8_000;
const SMTP_CONNECT_TIMEOUT_MS = 10_000;
const SMTP_SOCKET_TIMEOUT_MS = 15_000;

type ContactResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  _ts: number;
};

export async function submitContact(
  _prev: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  const raw = {
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    turnstileToken: formData.get("cf-turnstile-response") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    }
    return { success: false, message: "validation_failed", errors, _ts: Date.now() };
  }

  const { name, email, message, turnstileToken } = parsed.data;

  // Verify Turnstile token
  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY ?? "",
          response: turnstileToken,
        }),
        signal: AbortSignal.timeout(CAPTCHA_TIMEOUT_MS),
      }
    );
    const verifyData = (await verifyRes.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (!verifyData.success) {
      console.error("[contact] Turnstile rejected the token:", verifyData["error-codes"]);
      return { success: false, message: "captcha_failed", _ts: Date.now() };
    }
  } catch (err) {
    console.error("[contact] Turnstile verification failed:", err);
    return { success: false, message: "captcha_error", _ts: Date.now() };
  }

  // Send email
  try {
    // 465 is implicit TLS; any other port (587) starts in plain text and must
    // upgrade with STARTTLS. Some hosts block outbound 465, so both are supported.
    const port = Number(process.env.SMTP_PORT ?? "465");
    const implicitTls = port === 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: implicitTls,
      requireTLS: !implicitTls,
      connectionTimeout: SMTP_CONNECT_TIMEOUT_MS,
      greetingTimeout: SMTP_CONNECT_TIMEOUT_MS,
      socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DevOpsFlow Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_TO ?? "info@skynet.hosting",
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return { success: true, message: "success", _ts: Date.now() };
  } catch (err) {
    console.error("[contact] SMTP error:", err);
    return { success: false, message: "send_error", _ts: Date.now() };
  }
}
