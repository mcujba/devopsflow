import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
const createTransport = vi.fn<(options: Record<string, unknown>) => { sendMail: typeof sendMail }>(() => ({ sendMail }));

vi.mock("nodemailer", () => ({ default: { createTransport: (o: Record<string, unknown>) => createTransport(o) } }));

import { submitContact } from "@/app/actions/contact";

const previous = { success: false, message: "", _ts: 0 };

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I need help with a Kubernetes migration.",
  "cf-turnstile-response": "token",
};

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });
  sendMail.mockResolvedValue({});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("submitContact validation", () => {
  it("rejects each invalid field with its own message key, before any network call", async () => {
    const result = await submitContact(previous, form({ name: "A", email: "not-an-email", message: "short", "cf-turnstile-response": "" }));
    expect(result.success).toBe(false);
    expect(result.message).toBe("validation_failed");
    expect(result.errors).toEqual({
      name: "validation_name_min",
      email: "validation_email_invalid",
      message: "validation_message_min",
      turnstileToken: "validation_captcha_required",
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("rejects over-long input", async () => {
    const result = await submitContact(previous, form({ ...valid, name: "x".repeat(101), message: "y".repeat(5001) }));
    expect(result.errors).toEqual({ name: "validation_name_max", message: "validation_message_max" });
  });
});

describe("submitContact delivery", () => {
  it("sends the message to the owner with the visitor as reply-to", async () => {
    const result = await submitContact(previous, form(valid));
    expect(result).toMatchObject({ success: true, message: "success" });
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0]).toMatchObject({ replyTo: "ada@example.com", subject: "New contact from Ada Lovelace" });
  });

  it("gives the captcha check and the mail server a deadline, so a dead connection cannot hang the form", async () => {
    await submitContact(previous, form(valid));
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const options = createTransport.mock.calls[0][0] as Record<string, number>;
    for (const key of ["connectionTimeout", "greetingTimeout", "socketTimeout"]) {
      expect(options[key], key).toBeGreaterThan(0);
      expect(options[key], key).toBeLessThanOrEqual(15_000);
    }
  });

  it("uses implicit TLS on port 465, the default", async () => {
    await submitContact(previous, form(valid));
    expect(createTransport.mock.calls[0][0]).toMatchObject({ port: 465, secure: true });
  });

  it("uses STARTTLS on port 587, for hosts that block outbound 465", async () => {
    vi.stubEnv("SMTP_PORT", "587");
    await submitContact(previous, form(valid));
    expect(createTransport.mock.calls[0][0]).toMatchObject({ port: 587, secure: false, requireTLS: true });
  });

  it("reports a failed captcha without sending mail", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: false, "error-codes": ["invalid-input-secret"] }) });
    const result = await submitContact(previous, form(valid));
    expect(result).toMatchObject({ success: false, message: "captcha_failed" });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("reports an unreachable captcha service", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));
    expect(await submitContact(previous, form(valid))).toMatchObject({ success: false, message: "captcha_error" });
  });

  it("reports a mail server failure instead of throwing", async () => {
    sendMail.mockRejectedValue(new Error("Connection timeout"));
    expect(await submitContact(previous, form(valid))).toMatchObject({ success: false, message: "send_error" });
  });
});
