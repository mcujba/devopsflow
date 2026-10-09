import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Unit } from "@/components/rack/unit";
import { Socket } from "@/components/rack/port";
import { certificationsByIssuer, formatPeriod } from "@/lib/certifications";

const actionClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4";

export function CertificationList() {
  const t = useTranslations("Certifications");
  const locale = useLocale();

  return (
    <>
      {certificationsByIssuer().map((group) => (
        <Unit key={group.issuer} labelledBy={`issuer-${group.issuer}`}>
          <h2 id={`issuer-${group.issuer}`} className="display text-2xl">
            {group.name}
          </h2>
          <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
            {group.items.map((cert) => (
              <li key={cert.id} className="raised grid grid-cols-[4rem_minmax(0,1fr)] gap-4 p-4">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <Socket className="mt-1" />
                )}
                <div>
                  <h3 className="display text-base leading-snug">{cert.name}</h3>
                  <p className="mt-1.5 font-mono text-xs text-ink-muted">{formatPeriod(cert, locale)}</p>
                  {cert.credentialId && (
                    <p className="mt-1 text-xs text-ink-muted">
                      {t("credential_id")}: <span className="font-mono text-ink">{cert.credentialId}</span>
                    </p>
                  )}
                  {(cert.verifyUrl || cert.download) && (
                    <p className="mt-1 flex flex-wrap gap-x-5">
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t("verify")}: ${cert.name}`}
                          className={actionClass}
                        >
                          {t("verify")} ↗
                        </a>
                      )}
                      {cert.download && (
                        <a
                          href={cert.download}
                          download
                          aria-label={`${t("download")}: ${cert.name}`}
                          className={actionClass}
                        >
                          {t("download")} ↓
                        </a>
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Unit>
      ))}
    </>
  );
}
