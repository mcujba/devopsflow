import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { IBM_Plex_Mono, Jost, Playfair_Display } from "next/font/google";
import { FaceplateStrip } from "@/components/rack/faceplate-strip";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

// `subsets` only controls what is preloaded: latin-ext and cyrillic glyphs still
// load on demand through unicode-range, so RO and RU keep the same typefaces.
const display = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | DevOpsFlow`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ro" | "ru")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  // Only the contact form reads translations on the client.
  const clientMessages = {
    ContactPage: messages.ContactPage,
    CTA: messages.CTA,
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col gap-2.5 px-2 py-3 sm:px-4 sm:py-5">
            <FaceplateStrip />
            <main className="flex flex-1 flex-col gap-2.5">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
