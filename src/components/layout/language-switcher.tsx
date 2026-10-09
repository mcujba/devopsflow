"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-1" role="radiogroup" aria-label={label}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={l === locale}
          className="key"
          onClick={() => router.replace(pathname, { locale: l })}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
