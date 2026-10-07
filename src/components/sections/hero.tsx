import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative px-4 pt-10 text-center sm:px-6 lg:px-8 lg:pt-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-xl bg-[radial-gradient(closest-side,rgba(204,38,213,0.25),transparent)] opacity-40 dark:opacity-100"
      />
      <p className="relative inline-block rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
        {t("pill")}
      </p>
      <h1 className="relative mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
        {t("title_1")} <span className="text-gradient">{t("title_2")}</span>
      </h1>
      <p className="relative mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
        {t("description")}
      </p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/#contact" className="btn-primary">
          {t("cta_primary")}
        </Link>
        <Link href="/#services" className="btn-ghost">
          {t("cta_secondary")}
        </Link>
      </div>
    </section>
  );
}
