import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Terminal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("Footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">
                DevOps<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("description")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("location")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold">{t("services")}</h3>
            <ul className="mt-3 space-y-2">
              {[
                "CI/CD Pipelines",
                "Kubernetes",
                "Cloud Infrastructure",
                "Monitoring",
                "Security",
                "Network Engineering",
                "Linux Systems",
                "Consulting",
              ].map((name) => (
                <li key={name}>
                  <Link
                    href="/services"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">{t("company")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-semibold">Certifications</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "CKA",
                "CCNP",
                "CCNA",
                "LPIC-1",
                "NSE-5",
                "NSE-4",
                "JNCIS-ENT",
                "JNCIA",
                "MTCNA",
                "MTCWE",
              ].map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {currentYear} DevOpsFlow. {t("rights")}
          </p>
          <p>DevOpsFlow.io</p>
        </div>
      </div>
    </footer>
  );
}
