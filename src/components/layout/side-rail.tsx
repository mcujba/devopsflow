import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site";

export function SideRail() {
  const t = useTranslations("Nav");

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center gap-10 border-r border-border bg-background py-5 lg:flex">
      <Link
        href="/"
        aria-label="DevOpsFlow"
        className="bg-gradient-solid block h-7 w-7 rounded-lg"
      />
      <nav aria-label="Main" className="flex flex-col items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className="rotate-180 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors [writing-mode:vertical-rl] hover:text-foreground"
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
