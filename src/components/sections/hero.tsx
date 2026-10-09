import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { Lcd } from "@/components/rack/lcd";
import { PortLink } from "@/components/rack/port";
import { services } from "@/lib/services";
import { STATS } from "@/lib/site";

export function Hero() {
  const t = useTranslations("Hero");
  const tLcd = useTranslations("Lcd");
  const tPorts = useTranslations("Ports");

  return (
    <Unit>
      <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
        <div>
          <p className="engraved">{t("role")}</p>
          <h1 className="display mt-2 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.25rem]">
            {t("title_1")} <em>{t("title_2")}</em>
          </h1>
          <p className="relief mt-4 max-w-md leading-relaxed text-ink-muted">{t("description")}</p>
        </div>
        <Lcd items={STATS.map(({ key, lcd }) => ({ label: tLcd(key), value: lcd }))} />
      </div>

      <div className="mt-6 grid items-end gap-5 lg:grid-cols-[1fr_auto]">
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {services.map((service) => (
            <li key={service.slug}>
              <PortLink href={`/services/${service.slug}`} label={tPorts(service.key)} />
            </li>
          ))}
        </ul>
        <Link href="/#contact" className="key-red">
          {t("cta_primary")}
        </Link>
      </div>
    </Unit>
  );
}
