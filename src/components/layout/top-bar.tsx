import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function TopBar() {
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:static lg:justify-end lg:border-0 lg:bg-transparent lg:px-8 lg:backdrop-blur-none">
      <Link href="/" className="flex items-center gap-2 font-bold tracking-tight lg:hidden">
        <span aria-hidden="true" className="bg-gradient-solid block h-6 w-6 rounded-md" />
        DevOpsFlow
      </Link>

      <div className="flex items-center gap-1">
        <LanguageSwitcher label={t("language")} />
        <ThemeToggle label={t("theme")} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{t("menu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px]"
            closeLabel={t("close")}
            aria-describedby={undefined}
          >
            <SheetTitle className="px-4 pt-4">DevOpsFlow</SheetTitle>
            <nav aria-label={t("mobile_label")} className="mt-6 flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.key}>
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
