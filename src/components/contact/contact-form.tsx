"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/app/actions/contact";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

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

  return (
    <div className="card-surface p-6 sm:p-8">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div
        className="mb-6 flex items-center gap-2"
      >
        <Send className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">{tCta("form_title")}</h2>
      </div>

      {/* Success banner */}
      {state.success && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4"
        >
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
          <p className="text-sm text-green-700 dark:text-green-300">
            {t("success")}
          </p>
        </div>
      )}

      {/* Error banner */}
      {!state.success && state.message && !state.errors && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm text-destructive">
            {t(state.message as Parameters<typeof t>[0])}
          </p>
        </div>
      )}

      <form key={formKey} action={formAction}>
        <div
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name" className="mb-1.5 text-xs font-medium text-muted-foreground">
              {tCta("form_name")}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              disabled={isPending}
            />
            {state.errors?.name && (
              <p className="mt-1 text-xs text-destructive">
                {t(state.errors.name as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="mb-1.5 text-xs font-medium text-muted-foreground">
              {tCta("form_email")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-destructive">
                {t(state.errors.email as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="mb-1.5 text-xs font-medium text-muted-foreground">
              {tCta("form_message")}
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              disabled={isPending}
            />
            {state.errors?.message && (
              <p className="mt-1 text-xs text-destructive">
                {t(state.errors.message as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <div
              className="cf-turnstile"
              data-sitekey={siteKey}
              data-theme="auto"
            />
            {state.errors?.turnstileToken && (
              <p className="mt-1 text-xs text-destructive">
                {t(state.errors.turnstileToken as Parameters<typeof t>[0])}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  {tCta("form_submit")}
                  <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
