import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Info */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("label")}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{t("info_email_label")}</p>
                  <a
                    href="mailto:info@skynet.hosting"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@skynet.hosting
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{t("info_phone_label")}</p>
                  <a
                    href="tel:+37360332333"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +373 60 332 333
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{t("info_location_label")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("info_location_value")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{t("info_hours_label")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("info_hours_value")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
