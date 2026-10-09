import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Unit } from "@/components/rack/unit";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/site";

const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-red";

export function Contact() {
  const t = useTranslations("ContactPage");

  return (
    <Unit id="contact" labelledBy="contact-title">
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="label-red">{t("label")}</p>
          <h2 id="contact-title" className="display mt-1 text-2xl sm:text-3xl">
            {t("title")}
          </h2>
          <p className="relief mt-3 leading-relaxed text-ink-muted">{t("description")}</p>

          <ul className="ledger mt-5 text-sm">
            <li className="flex gap-3 py-2.5">
              <Mail className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_email_label")}</p>
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-8 items-center text-ink-muted underline underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <Phone className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_phone_label")}</p>
                <p>
                  <a href={`tel:${CONTACT_PHONE}`} className="inline-flex min-h-8 items-center text-ink-muted underline underline-offset-4">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <MapPin className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_location_label")}</p>
                <p className="text-ink-muted">{t("info_location_value")}</p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <Clock className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_hours_label")}</p>
                <p className="text-ink-muted">{t("info_hours_value")}</p>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </Unit>
  );
}
