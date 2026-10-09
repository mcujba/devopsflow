"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContact } from "@/app/actions/contact";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; theme: "auto" }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const initialState = { success: false, message: "", errors: undefined, _ts: 0 };

export function ContactForm() {
  const t = useTranslations("ContactPage");
  const tCta = useTranslations("CTA");
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );
  // Use _ts as key to re-mount form + turnstile after successful submission
  const formKey = state._ts;

  // Turnstile only draws itself once, when its script first runs. The form is
  // mounted again on client-side navigation back to the page and after a
  // successful submit, so the widget is rendered explicitly on every mount.
  const widgetRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !widgetRef.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      theme: "auto",
    });
    return () => window.turnstile?.remove(widgetId);
  }, [scriptReady, formKey]);

  return (
    <div className="sheet p-5 sm:p-6">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <h3 className="display mb-4 text-lg">{tCta("form_title")}</h3>

      {/* Success banner */}
      {state.success && (
        <div className="mb-4 flex items-start gap-3 border border-ink/30 bg-enamel p-3" role="status">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm">{t("success")}</p>
        </div>
      )}

      {/* Error banner */}
      {!state.success && state.message && !state.errors && (
        <div className="mb-4 flex items-start gap-3 border border-red bg-enamel p-3" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red" aria-hidden="true" />
          <p className="text-sm text-red">{t(state.message as Parameters<typeof t>[0])}</p>
        </div>
      )}

      <form key={formKey} action={formAction}>
        <div
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="engraved mb-1.5 block">
              {tCta("form_name")}
            </label>
            <input
              className="field"
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              disabled={isPending}
            />
            {state.errors?.name && (
              <p className="mt-1 text-xs text-red">
                {t(state.errors.name as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="engraved mb-1.5 block">
              {tCta("form_email")}
            </label>
            <input
              className="field"
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-red">
                {t(state.errors.email as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="engraved mb-1.5 block">
              {tCta("form_message")}
            </label>
            <textarea
              className="field"
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              disabled={isPending}
            />
            {state.errors?.message && (
              <p className="mt-1 text-xs text-red">
                {t(state.errors.message as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <div ref={widgetRef} />
            {state.errors?.turnstileToken && (
              <p className="mt-1 text-xs text-red">
                {t(state.errors.turnstileToken as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="key-red w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  {tCta("form_submit")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
