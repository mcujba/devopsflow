import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/site";

export function Contact() {
  const t = useTranslations("ContactPage");

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{t("label")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("description")}</p>

          <dl className="mt-8 space-y-5 text-sm">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_email_label")}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-foreground">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_phone_label")}</dt>
                <dd>
                  <a href={`tel:${CONTACT_PHONE}`} className="text-muted-foreground hover:text-foreground">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_location_label")}</dt>
                <dd className="text-muted-foreground">{t("info_location_value")}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_hours_label")}</dt>
                <dd className="text-muted-foreground">{t("info_hours_value")}</dd>
              </div>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
