"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Language">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="text-border mx-0.5 select-none" aria-hidden="true">/</span>
          )}
          <button
            onClick={() => handleSwitch(l)}
            role="radio"
            aria-checked={l === locale}
            aria-label={l.toUpperCase()}
            className={`px-1 py-0.5 text-xs font-medium uppercase transition-colors rounded ${
              l === locale
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
