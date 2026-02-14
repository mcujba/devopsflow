"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";

const localeOrder: Locale[] = [...routing.locales];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = localeOrder.indexOf(locale as Locale);
  const nextLocale = localeOrder[(currentIndex + 1) % localeOrder.length];

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      className="gap-1.5 text-xs font-medium"
    >
      <Globe className="h-3.5 w-3.5" />
      {nextLocale.toUpperCase()}
    </Button>
  );
}
