# DevOpsFlow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformă devopsflow.io într-un site „carte de vizită” în stilul G (dark, gradient, editor de cod), cu SEO tehnic complet și aproape fără JavaScript pe client.

**Architecture:** Home devine o singură pagină lungă din secțiuni Server Component; paginile de servicii, About și Blog rămân, restilizate. Tot ce ține de URL-uri, metadate și JSON-LD trece printr-un singur modul pur (`src/lib/seo.ts`), testat unitar. Framer Motion dispare; rămân client doar meniul mobil, comutatoarele de temă/limbă și formularul.

**Tech Stack:** Next.js 16.1 App Router, React 19, TypeScript strict, Tailwind 4, shadcn/ui, next-intl 4, MDX, Vitest + Testing Library, Docker standalone.

**Spec:** `docs/superpowers/specs/2026-10-07-devopsflow-redesign-design.md`

## Global Constraints

- Branch `feat/redesign`. Nimic pe `main`, niciun push, niciun deploy fără confirmarea proprietarului.
- Dependențe noi: niciuna. Singura schimbare în `package.json` este eliminarea `framer-motion`.
- Nu se modifică funcțional: `src/app/actions/contact.ts`, `src/lib/blog.ts`, `src/i18n/*`, `Dockerfile`, `.github/workflows/ci-cd.yml`.
- Limbi: `en` (implicit, fără prefix), `ro`, `ru`. Orice cheie nouă de traducere se adaugă în toate cele trei fișiere din `messages/`.
- Cifre permise, exact: `10+`, `10M+`, `60%`, `99.9%`. Nu se adaugă alte cifre, clienți, testimoniale sau certificări.
- STM Telecom nu apare nicăieri (cheile `tl_stm_*` se șterg).
- Angajatorii apar ca experiență, niciodată ca clienți.
- Server Components implicit. `"use client"` e permis doar în: `components/ui/*`, `theme-provider.tsx`, `layout/theme-toggle.tsx`, `layout/language-switcher.tsx`, `contact/contact-form.tsx`.
- Iconițele decorative au `aria-hidden="true"`. Un singur `<h1>` pe pagină.
- Animații: doar tranziții CSS, dezactivate sub `prefers-reduced-motion`.
- Fonturi: Inter Tight și JetBrains Mono prin `next/font/google`, subseturi `latin`, `latin-ext`, `cyrillic`.
- Commit-uri convenționale (`feat:`, `fix:`, `docs:`, `chore:`), fiecare încheiat cu `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- După fiecare task: `npm run type-check && npm run lint && npm test` trec.

**Abateri deliberate de la spec (de confirmat la revizuire):**
- Redirecturile sunt 308, nu 301. Next.js emite 308 pentru `permanent: true`; motoarele de căutare le tratează la fel.
- Gradientul are două variante: una luminoasă pentru text pe fundal închis (`#ff4d6d → #e03ad6 → #9a5bff`) și una mai închisă pentru butoane și tema light (`#d90429 → #b51fc0 → #6a00e6`). Varianta din spec (`#f0060b → #cc26d5 → #7702ff`) dă contrast de circa 4.4:1 cu text alb, sub pragul AA de 4.5:1.
- Navigarea mobilă se numește `layout/top-bar.tsx` (nu `mobile-bar`), fiindcă ține și comutatoarele de limbă/temă pe desktop.

## Review Focus

1. **URL-uri vechi**: `/services`, `/contact`, `/ro/services`, `/ru/contact`, `/en/services` trebuie să redirecționeze la secțiunea corectă din Home, nu să dea 404. (Task 8, verificare cu `curl`.)
2. **Paritatea cheilor de traducere**: o cheie lipsă în `ro.json` sau `ru.json` strică pagina doar în acea limbă. (Task 3, test de paritate.)
3. **Navigare prin ancore din pagini interioare**: „Servicii” apăsat pe `/ro/about` trebuie să ducă la `/ro#services`, nu la `#services` pe pagina curentă. (Task 4, test pe `href`.)
4. **Text tradus în JSON-LD**: un `<` într-un titlu nu are voie să închidă tag-ul `<script>`. (Task 2, test pe `serializeJsonLd`.)
5. **Adrese inexistente**: `/ro/orice` trebuie să dea 404 localizat, în stilul site-ului, nu pagina implicită Next. (Task 10, verificare cu `curl`.)

---

## Harta fișierelor

| Fișier | Acțiune | Responsabilitate |
|---|---|---|
| `src/lib/site.ts` | nou | Constante: URL, contact, cifre, certificări, linkuri de navigare |
| `src/lib/seo.ts` | nou | Căi localizate, metadate, constructori JSON-LD |
| `src/components/json-ld.tsx` | nou | Redă un `<script type="application/ld+json">` |
| `src/app/sitemap.ts`, `src/app/robots.ts` | nou | Sitemap și robots |
| `src/app/globals.css` | modificat | Tokenuri de culoare, gradient, butoane |
| `src/app/[locale]/layout.tsx` | modificat | Fonturi, `metadataBase`, schelet nou |
| `src/components/layout/side-rail.tsx`, `top-bar.tsx` | nou | Navigare desktop și mobil |
| `src/components/layout/footer.tsx` | rescris | Linkuri reale spre servicii |
| `src/components/sections/{hero,code-window,proof,services,about-teaser,process,contact,cta-band}.tsx` | nou/rescris | Secțiunile din Home și banda CTA |
| `src/components/services/*` | rescris | Pagina de detaliu, fără animații |
| `src/components/about/about-sections.tsx` | modificat | Fără animații, fără STM |
| `src/components/blog/*`, `src/app/[locale]/blog/**` | modificat | Fără animații, metadate, JSON-LD |
| `src/app/[locale]/not-found.tsx`, `[...rest]/page.tsx`, `opengraph-image.tsx` | nou | 404 localizat, imagine OG |
| `next.config.ts`, `src/middleware.ts` | modificat | Redirecturi; excepție pentru imaginea OG |
| `messages/{en,ro,ru}.json` | modificat | Copy nou, chei STM șterse |

Fișiere șterse pe parcurs: `components/motion-provider.tsx`, `components/layout/header.tsx`, `components/sections/{stats,certifications,cta,services-cta,services-grid,services-hero,services-preview,terminal-animation}.tsx`, `components/services/service-card.tsx`, `app/[locale]/services/page.tsx`, `app/[locale]/contact/page.tsx`.

---

### Task 1: Igienă de repo și punct de plecare verde

**Files:**
- Modify: indexul git (scoate `node_modules/`)
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

**Interfaces:**
- Consumes: nimic
- Produces: un arbore de lucru în care `npm run type-check && npm run lint && npm test` trec înainte de orice schimbare

- [ ] **Step 1: Instalează dependențele și confirmă starea inițială**

Run: `npm ci && npm run type-check && npm run lint && npm test`
Expected: toate trec. Dacă ceva pică aici, oprește-te și raportează; nu repara în acest plan.

- [ ] **Step 2: Scoate `node_modules/` din index**

```bash
git rm -r -q --cached node_modules
git ls-files node_modules | wc -l
```
Expected: `0`. Fișierele rămân pe disc; `/node_modules` e deja în `.gitignore`.

- [ ] **Step 3: Șterge SVG-urile implicite**

```bash
grep -rn "file.svg\|globe.svg\|next.svg\|vercel.svg\|window.svg" src || echo "no references"
git rm -q public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```
Expected: `no references`, apoi ștergere fără erori.

- [ ] **Step 4: Verifică din nou și comite**

```bash
npm run type-check && npm run lint && npm test
git commit -q -m "chore: untrack node_modules and remove default public assets"
```

---

### Task 2: Nucleul SEO (`site.ts`, `seo.ts`, `JsonLd`)

**Files:**
- Create: `src/lib/site.ts`, `src/lib/seo.ts`, `src/components/json-ld.tsx`
- Test: `src/__tests__/seo.test.ts`

**Interfaces:**
- Consumes: `routing`, `Locale` din `@/i18n/routing`
- Produces:
  - `site.ts`: `SITE_URL`, `SITE_NAME`, `LEGAL_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE`, `CONTACT_PHONE_DISPLAY`, `STATS`, `CERTIFICATIONS`, `NAV_LINKS`, `OG_LOCALES`
  - `seo.ts`: `localePath(locale, path): string`, `absoluteUrl(locale, path): string`, `languageAlternates(path, opts?): Record<string, string>`, `pageMetadata({locale, path, title, description, locales?}): Metadata`, `personJsonLd(locale)`, `professionalServiceJsonLd(locale, description)`, `serviceJsonLd({locale, slug, name, description})`, `breadcrumbJsonLd(items)`, `blogPostingJsonLd({locale, slug, title, description, date, author})`, `serializeJsonLd(data): string`
  - `json-ld.tsx`: `<JsonLd data={object} />`

- [ ] **Step 1: Scrie testul**

`src/__tests__/seo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  localePath,
  absoluteUrl,
  languageAlternates,
  pageMetadata,
  personJsonLd,
  professionalServiceJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  blogPostingJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

describe("localePath", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/about")).toBe("/about");
  });

  it("prefixes other locales without a trailing slash", () => {
    expect(localePath("ro", "/")).toBe("/ro");
    expect(localePath("ru", "/services/kubernetes")).toBe("/ru/services/kubernetes");
  });
});

describe("absoluteUrl", () => {
  it("builds absolute URLs on the production host", () => {
    expect(absoluteUrl("en", "/")).toBe("https://devopsflow.io");
    expect(absoluteUrl("ro", "/about")).toBe("https://devopsflow.io/ro/about");
  });
});

describe("languageAlternates", () => {
  it("lists every locale plus x-default", () => {
    expect(languageAlternates("/about")).toEqual({
      en: "/about",
      ro: "/ro/about",
      ru: "/ru/about",
      "x-default": "/about",
    });
  });

  it("supports absolute URLs and a subset of locales", () => {
    expect(languageAlternates("/blog/x", { absolute: true, locales: ["ro"] })).toEqual({
      ro: "https://devopsflow.io/ro/blog/x",
    });
  });
});

describe("pageMetadata", () => {
  it("sets canonical, hreflang and Open Graph for the page", () => {
    const meta = pageMetadata({
      locale: "ro",
      path: "/about",
      title: "Despre",
      description: "Descriere",
    });
    expect(meta.alternates?.canonical).toBe("/ro/about");
    expect(meta.alternates?.languages).toHaveProperty("x-default", "/about");
    expect(meta.openGraph).toMatchObject({ url: "/ro/about", locale: "ro_RO", title: "Despre" });
  });
});

describe("JSON-LD builders", () => {
  it("describes the person without STM Telecom", () => {
    const json = JSON.stringify(personJsonLd("en"));
    expect(json).toContain('"@type":"Person"');
    expect(json).toContain("Maxim Cujba");
    expect(json).toContain("CKA");
    expect(json).not.toContain("STM");
  });

  it("describes the business and links it to the person", () => {
    const data = professionalServiceJsonLd("en", "desc");
    expect(data["@type"]).toBe("ProfessionalService");
    expect(data.url).toBe("https://devopsflow.io");
    expect(data.founder).toEqual({ "@id": "https://devopsflow.io/#person" });
  });

  it("describes a service at its localized URL", () => {
    const data = serviceJsonLd({ locale: "ru", slug: "kubernetes", name: "K8s", description: "d" });
    expect(data.url).toBe("https://devopsflow.io/ru/services/kubernetes");
  });

  it("numbers breadcrumb items from 1", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", url: "https://devopsflow.io" },
      { name: "K8s", url: "https://devopsflow.io/services/kubernetes" },
    ]);
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it("describes a blog post with its language", () => {
    const data = blogPostingJsonLd({
      locale: "ro",
      slug: "post",
      title: "T",
      description: "D",
      date: "2025-01-15",
      author: "Maxim Cujba",
    });
    expect(data.inLanguage).toBe("ro");
    expect(data.url).toBe("https://devopsflow.io/ro/blog/post");
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so translated text cannot close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)");
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/seo.test.ts`
Expected: FAIL, „Failed to resolve import "@/lib/seo"”.

- [ ] **Step 3: Scrie `src/lib/site.ts`**

```ts
import type { Locale } from "@/i18n/routing";

export const SITE_URL = "https://devopsflow.io";
export const SITE_NAME = "DevOpsFlow";
export const LEGAL_NAME = "Skynet Hosting SRL";
export const CONTACT_EMAIL = "info@skynet.hosting";
export const CONTACT_PHONE = "+37360332333";
export const CONTACT_PHONE_DISPLAY = "+373 60 332 333";

export const STATS = [
  { key: "experience", value: "10+" },
  { key: "requests", value: "10M+" },
  { key: "deploys", value: "60%" },
  { key: "uptime", value: "99.9%" },
] as const;

export const CERTIFICATIONS = [
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
] as const;

export const NAV_LINKS = [
  { key: "services", href: "/#services" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/#contact" },
] as const;

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ro: "ro_RO",
  ru: "ru_RU",
};
```

- [ ] **Step 4: Scrie `src/lib/seo.ts`**

```ts
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CERTIFICATIONS,
  OG_LOCALES,
} from "@/lib/site";

const PERSON_ID = `${SITE_URL}/#person`;
const BUSINESS_ID = `${SITE_URL}/#business`;

export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  const localized = localePath(locale, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

interface AlternateOptions {
  absolute?: boolean;
  locales?: readonly Locale[];
}

export function languageAlternates(
  path: string,
  { absolute = false, locales = routing.locales }: AlternateOptions = {},
): Record<string, string> {
  const build = absolute ? absoluteUrl : localePath;
  const alternates: Record<string, string> = {};
  for (const locale of locales) alternates[locale] = build(locale, path);
  if (locales.includes(routing.defaultLocale)) {
    alternates["x-default"] = build(routing.defaultLocale, path);
  }
  return alternates;
}

interface PageMetadataInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  locales?: readonly Locale[];
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  locales,
}: PageMetadataInput): Metadata {
  const url = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path, { locales }),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Maxim Cujba",
    jobTitle: "Senior DevOps Engineer",
    url: absoluteUrl(locale, "/about"),
    worksFor: { "@type": "Organization", name: LEGAL_NAME },
    knowsAbout: ["Kubernetes", "CI/CD", "Terraform", "AWS", "Linux", "Network engineering"],
    hasCredential: CERTIFICATIONS.map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
    })),
  };
}

export function professionalServiceJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: absoluteUrl(locale, "/"),
    description,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chișinău",
      addressCountry: "MD",
    },
    founder: { "@id": PERSON_ID },
  };
}

interface ServiceInput {
  locale: Locale;
  slug: string;
  name: string;
  description: string;
}

export function serviceJsonLd({ locale, slug, name, description }: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl(locale, `/services/${slug}`),
    provider: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface BlogPostingInput {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

export function blogPostingJsonLd({
  locale,
  slug,
  title,
  description,
  date,
  author,
}: BlogPostingInput) {
  const url = absoluteUrl(locale, `/blog/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: author },
    publisher: { "@id": BUSINESS_ID },
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```

- [ ] **Step 5: Scrie `src/components/json-ld.tsx`**

```tsx
import { serializeJsonLd } from "@/lib/seo";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
```

- [ ] **Step 6: Rulează testele și comite**

Run: `npx vitest run src/__tests__/seo.test.ts && npm run type-check && npm run lint`
Expected: PASS, fără erori.

```bash
git add src/lib/site.ts src/lib/seo.ts src/components/json-ld.tsx src/__tests__/seo.test.ts
git commit -q -m "feat: add site constants and SEO helpers"
```

---

### Task 3: Traduceri noi (doar adăugări)

Acest task doar adaugă chei, ca site-ul vechi să rămână funcțional. Cheile vechi se șterg în task-urile care elimină componentele ce le folosesc.

**Files:**
- Modify: `messages/en.json`, `messages/ro.json`, `messages/ru.json`
- Test: `src/__tests__/messages.test.ts`

**Interfaces:**
- Consumes: nimic
- Produces (în toate cele 3 limbi): `Metadata.title`, `Metadata.description` (valori noi); `Nav.menu`; `Hero.pill`, `Hero.title_1`, `Hero.title_2` (plus `Hero.description`, `Hero.cta_primary`, `Hero.cta_secondary` cu valori noi); `Services.{ci_cd,kubernetes,cloud,monitoring,security,networking,linux,consulting}_short`; `Home.proof_title`, `Home.about_label`, `Home.about_title`, `Home.about_p`, `Home.about_link`; `NotFound.title`, `NotFound.description`, `NotFound.cta`

- [ ] **Step 1: Scrie testul**

`src/__tests__/messages.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import en from "../../messages/en.json";
import ro from "../../messages/ro.json";
import ru from "../../messages/ru.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : flatten(value, `${prefix}${key}.`),
  );
}

const keys = {
  en: flatten(en as Tree).sort(),
  ro: flatten(ro as Tree).sort(),
  ru: flatten(ru as Tree).sort(),
};

describe("translation files", () => {
  it("have identical keys in every locale", () => {
    expect(keys.ro).toEqual(keys.en);
    expect(keys.ru).toEqual(keys.en);
  });

  it("have no empty values", () => {
    for (const messages of [en, ro, ru]) {
      const empty = Object.entries(messages as Tree).flatMap(([ns, tree]) =>
        Object.entries(tree as Tree)
          .filter(([, value]) => value === "")
          .map(([key]) => `${ns}.${key}`),
      );
      expect(empty).toEqual([]);
    }
  });

  it("contain the redesign keys", () => {
    for (const key of [
      "Nav.menu",
      "Hero.pill",
      "Hero.title_1",
      "Hero.title_2",
      "Services.consulting_short",
      "Home.about_title",
      "NotFound.title",
    ]) {
      expect(keys.en).toContain(key);
    }
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/messages.test.ts`
Expected: FAIL la „contain the redesign keys” (`Nav.menu` lipsește).

- [ ] **Step 3: Editează `messages/en.json`**

Înlocuiește valorile din `Metadata` și `Hero`, adaugă `menu` în `Nav`, adaugă cele 8 chei `_short` în `Services` (fără să ștergi cheile existente) și adaugă namespace-urile `Home` și `NotFound`:

```json
"Metadata": {
  "title": "DevOps Consulting: Kubernetes, CI/CD & Cloud | DevOpsFlow",
  "description": "Senior DevOps engineer for hire: Kubernetes, CI/CD and cloud infrastructure for teams that can't afford downtime. CKA certified. Free consultation."
},
"Nav": { "menu": "Menu" },
"Hero": {
  "pill": "Maxim Cujba · Senior DevOps Engineer · CKA",
  "title_1": "Reliability meets",
  "title_2": "delivery speed",
  "description": "Kubernetes, CI/CD and cloud engineering for teams that can't afford downtime. Over ten years in production, from a telecom NOC to AWS EKS.",
  "cta_primary": "Book a free consultation",
  "cta_secondary": "See services"
},
"Services": {
  "ci_cd_short": "Pipelines that build, test and deploy on every commit, with automatic rollback.",
  "kubernetes_short": "Production clusters designed, deployed and kept healthy, in the cloud or on-premise.",
  "cloud_short": "Infrastructure as Code with Terraform on AWS, GCP and bare metal. Reproducible and auditable.",
  "monitoring_short": "Metrics, logs and alerts with Prometheus and Grafana, so you hear about problems first.",
  "security_short": "Hardening, secrets management and vulnerability scanning built into the pipeline.",
  "networking_short": "Cisco, Juniper, FortiGate and MikroTik networks, designed and automated.",
  "linux_short": "Server administration, performance tuning and patching for fleets of any size.",
  "consulting_short": "Architecture reviews and a second pair of eyes before you commit to a platform."
},
"Home": {
  "proof_title": "Results and certifications",
  "about_label": "About",
  "about_title": "A senior engineer, not an agency",
  "about_p": "I'm Maxim Cujba, founder of Skynet Hosting SRL. I started in 2012 in a telecom NOC and have been running networks, Kubernetes clusters and CI/CD pipelines in production ever since. You work with me directly, from the first call to the handoff.",
  "about_link": "Full background"
},
"NotFound": {
  "title": "Page not found",
  "description": "The page you're looking for doesn't exist or has moved.",
  "cta": "Back to home"
}
```

În `Hero`, cheile vechi `title` și `subtitle` rămân deocamdată (le folosește încă componenta veche).

- [ ] **Step 4: Editează `messages/ro.json`** (aceleași locuri)

```json
"Metadata": {
  "title": "Consultanță DevOps: Kubernetes, CI/CD și Cloud | DevOpsFlow",
  "description": "Inginer DevOps senior: Kubernetes, CI/CD și infrastructură cloud pentru echipe care nu-și permit downtime. Certificat CKA. Consultație gratuită."
},
"Nav": { "menu": "Meniu" },
"Hero": {
  "pill": "Maxim Cujba · Senior DevOps Engineer · CKA",
  "title_1": "Fiabilitate și",
  "title_2": "viteză de livrare",
  "description": "Inginerie Kubernetes, CI/CD și cloud pentru echipe care nu-și permit downtime. Peste zece ani în producție, de la un NOC de telecom la AWS EKS.",
  "cta_primary": "Programează o consultație gratuită",
  "cta_secondary": "Vezi serviciile"
},
"Services": {
  "ci_cd_short": "Pipeline-uri care construiesc, testează și livrează la fiecare commit, cu rollback automat.",
  "kubernetes_short": "Clustere de producție proiectate, instalate și menținute sănătoase, în cloud sau on-premise.",
  "cloud_short": "Infrastructure as Code cu Terraform pe AWS, GCP și bare metal. Reproductibil și auditabil.",
  "monitoring_short": "Metrici, loguri și alerte cu Prometheus și Grafana, ca să afli primul de probleme.",
  "security_short": "Hardening, gestionarea secretelor și scanare de vulnerabilități integrate în pipeline.",
  "networking_short": "Rețele Cisco, Juniper, FortiGate și MikroTik, proiectate și automatizate.",
  "linux_short": "Administrare de servere, optimizare de performanță și patching pentru parcuri de orice mărime.",
  "consulting_short": "Review de arhitectură și o a doua opinie înainte să alegi o platformă."
},
"Home": {
  "proof_title": "Rezultate și certificări",
  "about_label": "Despre",
  "about_title": "Un inginer senior, nu o agenție",
  "about_p": "Sunt Maxim Cujba, fondatorul Skynet Hosting SRL. Am început în 2012 într-un NOC de telecom și de atunci administrez în producție rețele, clustere Kubernetes și pipeline-uri CI/CD. Lucrezi direct cu mine, de la primul apel până la predare.",
  "about_link": "Parcursul complet"
},
"NotFound": {
  "title": "Pagina nu a fost găsită",
  "description": "Pagina căutată nu există sau a fost mutată.",
  "cta": "Înapoi la pagina principală"
}
```

- [ ] **Step 5: Editează `messages/ru.json`** (aceleași locuri)

```json
"Metadata": {
  "title": "DevOps-консалтинг: Kubernetes, CI/CD и облако | DevOpsFlow",
  "description": "Старший DevOps-инженер: Kubernetes, CI/CD и облачная инфраструктура для команд, которым нельзя простаивать. Сертификат CKA. Бесплатная консультация."
},
"Nav": { "menu": "Меню" },
"Hero": {
  "pill": "Maxim Cujba · Senior DevOps Engineer · CKA",
  "title_1": "Надёжность и",
  "title_2": "скорость поставки",
  "description": "Kubernetes, CI/CD и облачная инженерия для команд, которые не могут позволить себе простой. Более десяти лет в продакшене: от телеком-NOC до AWS EKS.",
  "cta_primary": "Записаться на бесплатную консультацию",
  "cta_secondary": "Смотреть услуги"
},
"Services": {
  "ci_cd_short": "Пайплайны, которые собирают, тестируют и выкатывают каждый коммит, с автоматическим откатом.",
  "kubernetes_short": "Продакшен-кластеры: проектирование, развёртывание и поддержка в облаке или on-premise.",
  "cloud_short": "Infrastructure as Code на Terraform для AWS, GCP и bare metal. Воспроизводимо и прозрачно.",
  "monitoring_short": "Метрики, логи и алерты на Prometheus и Grafana: о проблемах вы узнаёте первыми.",
  "security_short": "Hardening, управление секретами и сканирование уязвимостей прямо в пайплайне.",
  "networking_short": "Сети Cisco, Juniper, FortiGate и MikroTik: проектирование и автоматизация.",
  "linux_short": "Администрирование серверов, тюнинг производительности и обновления для парка любого размера.",
  "consulting_short": "Ревью архитектуры и второе мнение до того, как вы выберете платформу."
},
"Home": {
  "proof_title": "Результаты и сертификаты",
  "about_label": "Обо мне",
  "about_title": "Старший инженер, а не агентство",
  "about_p": "Я Максим Кужба, основатель Skynet Hosting SRL. Начинал в 2012 году в телеком-NOC и с тех пор веду в продакшене сети, кластеры Kubernetes и пайплайны CI/CD. Вы работаете со мной напрямую, от первого звонка до передачи проекта.",
  "about_link": "Полная биография"
},
"NotFound": {
  "title": "Страница не найдена",
  "description": "Страница, которую вы ищете, не существует или была перемещена.",
  "cta": "На главную"
}
```

- [ ] **Step 6: Rulează testele și comite**

Run: `npm test && npm run type-check`
Expected: PASS.

```bash
git add messages src/__tests__/messages.test.ts
git commit -q -m "feat: add redesign copy in en, ro and ru"
```

---

### Task 4: Scheletul vizual (tokenuri, fonturi, navigare, footer)

**Files:**
- Modify: `src/app/globals.css`, `src/app/[locale]/layout.tsx`, `src/components/layout/language-switcher.tsx`, `src/components/layout/theme-toggle.tsx`
- Create: `src/components/layout/side-rail.tsx`, `src/components/layout/top-bar.tsx`
- Rewrite: `src/components/layout/footer.tsx`
- Delete: `src/components/layout/header.tsx`, `src/components/motion-provider.tsx`
- Test: `src/__tests__/shell.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `CERTIFICATIONS`, `SITE_URL` din `@/lib/site`; `services` din `@/lib/services`
- Produces: `<SideRail />`, `<TopBar />`, `<Footer />`; clasele CSS `text-gradient`, `bg-gradient-solid`, `btn-primary`, `btn-ghost`, `card-surface`

- [ ] **Step 1: Scrie testul**

`src/__tests__/shell.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

import { render } from "@testing-library/react";
import { SideRail } from "@/components/layout/side-rail";
import { Footer } from "@/components/layout/footer";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("SideRail", () => {
  it("links to home sections with absolute anchors so they work from inner pages", () => {
    const { container } = render(<SideRail />);
    const links = hrefs(container);
    expect(links).toContain("/#services");
    expect(links).toContain("/#contact");
    expect(links).toContain("/about");
    expect(links).toContain("/blog");
    expect(links).not.toContain("#services");
  });

  it("labels the navigation landmark", () => {
    const { container } = render(<SideRail />);
    expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("Main");
  });
});

describe("Footer", () => {
  it("links every service to its own detail page", () => {
    const { container } = render(<Footer />);
    const links = hrefs(container);
    for (const slug of ["ci-cd", "kubernetes", "cloud", "monitoring", "security", "networking", "linux", "consulting"]) {
      expect(links).toContain(`/services/${slug}`);
    }
  });

  it("does not link to the removed listing and contact pages", () => {
    const { container } = render(<Footer />);
    const links = hrefs(container);
    expect(links).not.toContain("/services");
    expect(links).not.toContain("/contact");
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/shell.test.tsx`
Expected: FAIL, „Failed to resolve import "@/components/layout/side-rail"”.

- [ ] **Step 3: Înlocuiește tokenurile în `src/app/globals.css`**

În blocul `@theme inline`, schimbă cele două linii de font:

```css
  --font-sans: var(--font-inter-tight);
  --font-mono: var(--font-jetbrains-mono);
```

Înlocuiește integral blocurile `:root { ... }` și `.dark { ... }` cu:

```css
/* ── Light theme ───────────────────────────── */
:root {
  --radius: 0.875rem;
  --background: #fbfafc;
  --foreground: #0f0f11;
  --card: #ffffff;
  --card-foreground: #0f0f11;
  --popover: #ffffff;
  --popover-foreground: #0f0f11;
  --primary: #9c1aa8;
  --primary-foreground: #ffffff;
  --secondary: #f1f0f4;
  --secondary-foreground: #0f0f11;
  --muted: #f1f0f4;
  --muted-foreground: #5d5c66;
  --accent: #f1f0f4;
  --accent-foreground: #0f0f11;
  --destructive: #dc2626;
  --border: #e4e3e8;
  --input: #e4e3e8;
  --ring: #9c1aa8;
  --cyan: #9c1aa8;
  --cyan-foreground: #ffffff;
  --chart-1: #d90429;
  --chart-2: #b51fc0;
  --chart-3: #9c1aa8;
  --chart-4: #7c3aed;
  --chart-5: #6a00e6;
  --sidebar: #fbfafc;
  --sidebar-foreground: #0f0f11;
  --sidebar-primary: #9c1aa8;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f1f0f4;
  --sidebar-accent-foreground: #0f0f11;
  --sidebar-border: #e4e3e8;
  --sidebar-ring: #9c1aa8;
  --gradient-solid: linear-gradient(90deg, #d90429, #b51fc0 55%, #6a00e6);
  --gradient-text: linear-gradient(90deg, #d90429, #b51fc0 55%, #6a00e6);
}

/* ── Dark theme (default) ──────────────────── */
.dark {
  --background: #0f0f11;
  --foreground: #f6f5f7;
  --card: #141417;
  --card-foreground: #f6f5f7;
  --popover: #17171a;
  --popover-foreground: #f6f5f7;
  --primary: #e45ae0;
  --primary-foreground: #0f0f11;
  --secondary: #17171a;
  --secondary-foreground: #f6f5f7;
  --muted: #1e1e22;
  --muted-foreground: #a3a2a9;
  --accent: #1e1e22;
  --accent-foreground: #f6f5f7;
  --destructive: #f87171;
  --border: #2a2a2f;
  --input: #2a2a2f;
  --ring: #e45ae0;
  --cyan: #e45ae0;
  --cyan-foreground: #0f0f11;
  --chart-1: #ff4d6d;
  --chart-2: #e03ad6;
  --chart-3: #e45ae0;
  --chart-4: #b47cff;
  --chart-5: #9a5bff;
  --sidebar: #0f0f11;
  --sidebar-foreground: #f6f5f7;
  --sidebar-primary: #e45ae0;
  --sidebar-primary-foreground: #0f0f11;
  --sidebar-accent: #1e1e22;
  --sidebar-accent-foreground: #f6f5f7;
  --sidebar-border: #2a2a2f;
  --sidebar-ring: #e45ae0;
  --gradient-text: linear-gradient(90deg, #ff4d6d, #e03ad6 50%, #9a5bff);
}
```

Imediat după blocul `@layer base { ... }` existent, adaugă:

```css
@layer base {
  html {
    scroll-behavior: smooth;
  }
  section[id] {
    scroll-margin-top: 4.5rem;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .text-gradient {
    background-image: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .bg-gradient-solid {
    background-image: var(--gradient-solid);
  }
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2;
    background-image: var(--gradient-solid);
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2;
  }
  .card-surface {
    @apply rounded-[14px] border border-border bg-card;
  }
  .eyebrow {
    @apply font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground;
  }
}
```

- [ ] **Step 4: Scrie `src/components/layout/side-rail.tsx`**

```tsx
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
```

- [ ] **Step 5: Scrie `src/components/layout/top-bar.tsx`**

```tsx
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
        <LanguageSwitcher />
        <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{t("menu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetTitle className="px-4 pt-4">DevOpsFlow</SheetTitle>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 px-2">
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
```

- [ ] **Step 6: Mărește țintele de atingere în comutatoare**

În `src/components/layout/language-switcher.tsx`, în `className`-ul butonului, înlocuiește `px-1 py-0.5` cu `px-2 py-2`.

În `src/components/layout/theme-toggle.tsx`, înlocuiește ambele apariții ale `className="h-8 w-8"` cu `className="h-10 w-10"`, iar pe iconițele `<Sun ... />` și `<Moon ... />` adaugă `aria-hidden="true"`.

- [ ] **Step 7: Rescrie `src/components/layout/footer.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { CERTIFICATIONS } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Footer");
  const tServices = useTranslations("ServicesPage");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-bold tracking-tight">DevOpsFlow</p>
          <p className="mt-3 text-sm text-muted-foreground">{t("description")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("location")}</p>
        </div>

        <nav aria-label={t("services")}>
          <h2 className="text-sm font-semibold">{t("services")}</h2>
          <ul className="mt-3 space-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tServices(`${service.key}_title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("company")}>
          <h2 className="text-sm font-semibold">{t("company")}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <ul className="flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert} className="rounded-md border border-border px-2 py-0.5">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        &copy; {year} DevOpsFlow. {t("rights")}
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Actualizează `src/app/[locale]/layout.tsx`**

Înlocuiește importurile de font și de componente, constantele de font, `generateMetadata` și corpul `LocaleLayout`:

```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SideRail } from "@/components/layout/side-rail";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
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
    <html lang={locale} suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={clientMessages}>
            <SideRail />
            <div className="flex min-h-screen flex-col lg:pl-16">
              <TopBar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Șterge componentele înlocuite**

```bash
git rm -q src/components/layout/header.tsx src/components/motion-provider.tsx
grep -rn "layout/header\|motion-provider" src || echo "no references"
```
Expected: `no references`.

- [ ] **Step 10: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS (inclusiv `shell.test.tsx`).

Run: `npm run build`
Expected: build reușit. Componentele client vechi care citesc alte namespace-uri decât `ContactPage`/`CTA` pot afișa avertismente de mesaj lipsă; ele dispar în Task 5–9.

```bash
git add -A src
git commit -q -m "feat: add new visual shell with side rail and design tokens"
```

---

### Task 5: Home ca „carte de vizită”

**Files:**
- Rewrite: `src/components/sections/hero.tsx`, `src/components/sections/process.tsx`, `src/app/[locale]/page.tsx`, `src/__tests__/home.test.tsx`
- Create: `src/components/sections/code-window.tsx`, `proof.tsx`, `services.tsx`, `about-teaser.tsx`, `contact.tsx`
- Modify: `src/components/contact/contact-form.tsx` (fără animații), `messages/*.json` (șterge `Hero.title`, `Hero.subtitle`)
- Delete: `src/components/sections/stats.tsx`, `certifications.tsx`, `cta.tsx`, `services-preview.tsx`, `terminal-animation.tsx`

**Interfaces:**
- Consumes: `STATS`, `CERTIFICATIONS`, `CONTACT_EMAIL`, `CONTACT_PHONE`, `CONTACT_PHONE_DISPLAY` din `@/lib/site`; `services` din `@/lib/services`; `pageMetadata`, `personJsonLd`, `professionalServiceJsonLd` din `@/lib/seo`; `JsonLd`
- Produces: `<Hero />`, `<CodeWindow />`, `<Proof />`, `<Services />`, `<AboutTeaser />`, `<Process />`, `<Contact />`; ancorele `#proof`, `#services`, `#about`, `#process`, `#contact`

- [ ] **Step 1: Rescrie testul `src/__tests__/home.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/contact/contact-form", () => ({
  ContactForm: () => <form data-testid="contact-form" />,
}));

import { render } from "@testing-library/react";
import { Hero } from "@/components/sections/hero";
import { CodeWindow } from "@/components/sections/code-window";
import { Proof } from "@/components/sections/proof";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("Hero", () => {
  it("renders one h1 and both calls to action", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(hrefs(container)).toEqual(["/#contact", "/#services"]);
  });
});

describe("CodeWindow", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<CodeWindow />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Proof", () => {
  it("shows the four confirmed numbers as static text", () => {
    const { container } = render(<Proof />);
    for (const value of ["10+", "10M+", "60%", "99.9%"]) {
      expect(container.textContent).toContain(value);
    }
  });

  it("lists the certifications", () => {
    const { container } = render(<Proof />);
    expect(container.textContent).toContain("CKA");
    expect(container.textContent).toContain("JNCIS-ENT");
  });
});

describe("Services", () => {
  it("links each of the 8 services to its detail page", () => {
    const { container } = render(<Services />);
    const links = hrefs(container);
    expect(links.length).toBe(8);
    expect(links).toContain("/services/ci-cd");
    expect(links).toContain("/services/consulting");
  });
});

describe("AboutTeaser", () => {
  it("links to the full about page and omits STM Telecom", () => {
    const { container } = render(<AboutTeaser />);
    expect(hrefs(container)).toContain("/about");
    expect(container.textContent).not.toContain("tl_stm");
    expect(container.textContent).toContain("tl_duocircle_company");
  });
});

describe("Process", () => {
  it("renders the four steps in order", () => {
    const { container } = render(<Process />);
    const items = Array.from(container.querySelectorAll("li")).map((li) => li.textContent);
    expect(items.length).toBe(4);
    expect(items[0]).toContain("discovery_title");
    expect(items[3]).toContain("support_title");
  });
});

describe("Contact", () => {
  it("exposes the contact anchor, the form and direct contact links", () => {
    const { container, getByTestId } = render(<Contact />);
    expect(container.querySelector("section")?.id).toBe("contact");
    expect(getByTestId("contact-form")).toBeInTheDocument();
    expect(hrefs(container)).toContain("mailto:info@skynet.hosting");
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/home.test.tsx`
Expected: FAIL, „Failed to resolve import "@/components/sections/code-window"”.

- [ ] **Step 3: Rescrie `src/components/sections/hero.tsx`**

```tsx
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
```

- [ ] **Step 4: Scrie `src/components/sections/code-window.tsx`**

```tsx
const PIPELINE = [
  { step: "build", time: "41s" },
  { step: "test", time: "1m 12s" },
  { step: "scan", time: "23s" },
  { step: "deploy", time: "38s" },
] as const;

export function CodeWindow() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-12 grid max-w-4xl overflow-hidden rounded-[14px] border border-border bg-card text-left font-mono text-xs leading-7 md:grid-cols-[1.25fr_1fr]"
    >
      <div>
        <div className="border-b border-border px-4 py-2 text-muted-foreground">deploy.yml</div>
        <pre className="overflow-x-auto px-4 py-3 text-muted-foreground">
          <span className="text-primary">jobs</span>:{"\n"}
          {"  "}
          <span className="text-primary">deploy</span>:{"\n"}
          {"    "}
          <span className="text-primary">runs-on</span>: ubuntu-latest{"\n"}
          {"    "}
          <span className="text-primary">steps</span>:{"\n"}
          {"      "}- <span className="text-primary">run</span>: helm upgrade --atomic api ./chart{"\n"}
          {"      "}# rollback is automatic on failure
        </pre>
      </div>
      <div className="border-t border-border md:border-l md:border-t-0">
        <div className="border-b border-border px-4 py-2 text-muted-foreground">pipeline</div>
        <ul className="px-4 py-3 text-muted-foreground">
          {PIPELINE.map(({ step, time }) => (
            <li key={step} className="flex justify-between">
              <span>
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> {step}
              </span>
              <span>{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Scrie `src/components/sections/proof.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { CERTIFICATIONS, STATS } from "@/lib/site";

export function Proof() {
  const t = useTranslations("Stats");
  const tHome = useTranslations("Home");

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="sr-only">{tHome("proof_title")}</h2>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map(({ key, value }) => (
          <div key={key} className="card-surface flex flex-col-reverse p-5">
            <dt className="mt-1 text-sm text-muted-foreground">{t(`${key}_label`)}</dt>
            <dd className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-xs tracking-[0.1em] text-muted-foreground">
        {CERTIFICATIONS.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 6: Scrie `src/components/sections/services.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";

export function Services() {
  const t = useTranslations("Services");
  const tPage = useTranslations("ServicesPage");

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("label")}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="card-surface block h-full p-5 transition-colors hover:border-primary"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{tPage(`${service.key}_title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${service.key}_short`)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7: Scrie `src/components/sections/about-teaser.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const HIGHLIGHTS = ["duocircle", "ebs", "orange", "moldtelecom"] as const;

export function AboutTeaser() {
  const t = useTranslations("Home");
  const tAbout = useTranslations("AboutPage");

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[auto_1fr_1fr] lg:items-start">
        {/* Placeholder until the owner supplies a photo. */}
        <div
          aria-hidden="true"
          className="bg-gradient-solid flex h-28 w-28 items-center justify-center rounded-[14px] text-3xl font-extrabold text-white"
        >
          MC
        </div>

        <div>
          <p className="eyebrow">{t("about_label")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("about_title")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("about_p")}</p>
          <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
            {t("about_link")} →
          </Link>
        </div>

        <ul className="divide-y divide-border border-y border-border text-sm">
          {HIGHLIGHTS.map((key) => (
            <li key={key} className="flex items-baseline justify-between gap-4 py-3">
              <span>
                <span className="font-semibold">{tAbout(`tl_${key}_company`)}</span>
                <span className="block text-muted-foreground">{tAbout(`tl_${key}_role`)}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {tAbout(`tl_${key}_date`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Rescrie `src/components/sections/process.tsx`**

```tsx
import { useTranslations } from "next-intl";

const STEPS = ["discovery", "architecture", "implementation", "support"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("label")}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step} className="card-surface p-5">
            <span aria-hidden="true" className="text-gradient font-mono text-sm font-bold">
              0{index + 1}
            </span>
            <h3 className="mt-3 font-bold">{t(`${step}_title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`${step}_desc`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 9: Scrie `src/components/sections/contact.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/site";

export function Contact() {
  const t = useTranslations("ContactPage");

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{t("label")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("description")}</p>

          <dl className="mt-8 space-y-5 text-sm">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_email_label")}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-foreground">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_phone_label")}</dt>
                <dd>
                  <a href={`tel:${CONTACT_PHONE}`} className="text-muted-foreground hover:text-foreground">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_location_label")}</dt>
                <dd className="text-muted-foreground">{t("info_location_value")}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">{t("info_hours_label")}</dt>
                <dd className="text-muted-foreground">{t("info_hours_value")}</dd>
              </div>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Scoate animațiile din `src/components/contact/contact-form.tsx`**

Logica formularului nu se atinge. Rulează transformarea mecanică, apoi curăță manual:

```bash
perl -0pi -e '
  s/<(\/?)motion\.(\w+)/<$1$2/g;
  s/^\s*(?:variants|initial|whileInView|animate|viewport|transition)=(?:\{\{[^\n]*\}\}|\{[^\n{}]*\}|"[^"\n]*")\n//mg;
  s/\s(?:variants|initial|whileInView|animate)=(?:\{[A-Za-z]+\}|"[a-z]+")//g;
' src/components/contact/contact-form.tsx
```

Apoi, manual, în același fișier: șterge linia `import { motion } from "framer-motion";` și șterge integral constantele `formContainer` și `formField`. Schimbă `className`-ul containerului exterior în:

```tsx
<div className="card-surface p-6 sm:p-8">
```

Verificare:

```bash
grep -n "motion\|formContainer\|formField" src/components/contact/contact-form.tsx || echo "clean"
```
Expected: `clean`.

- [ ] **Step 11: Rescrie `src/app/[locale]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, personJsonLd, professionalServiceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { CodeWindow } from "@/components/sections/code-window";
import { Proof } from "@/components/sections/proof";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const meta = pageMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });

  return { ...meta, title: { absolute: t("title") } };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return (
    <>
      <JsonLd data={personJsonLd(locale as Locale)} />
      <JsonLd data={professionalServiceJsonLd(locale as Locale, t("description"))} />
      <Hero />
      <div className="px-4 sm:px-6 lg:px-8">
        <CodeWindow />
      </div>
      <Proof />
      <Services />
      <AboutTeaser />
      <Process />
      <Contact />
    </>
  );
}
```

- [ ] **Step 12: Șterge secțiunile vechi și cheile `Hero` vechi**

```bash
git rm -q src/components/sections/stats.tsx src/components/sections/certifications.tsx \
  src/components/sections/cta.tsx src/components/sections/services-preview.tsx \
  src/components/sections/terminal-animation.tsx
```

În `messages/en.json`, `messages/ro.json` și `messages/ru.json`, șterge din `Hero` cheile `title` și `subtitle`.

```bash
grep -rn "sections/stats\|sections/certifications\|sections/cta\"\|services-preview\|terminal-animation" src || echo "no references"
```
Expected: `no references`.

- [ ] **Step 13: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS.

```bash
git add -A src messages
git commit -q -m "feat: rebuild home page as a single business-card page"
```

---

### Task 6: Sitemap și robots

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `src/__tests__/sitemap.test.ts`

**Interfaces:**
- Consumes: `absoluteUrl`, `languageAlternates` din `@/lib/seo`; `services` din `@/lib/services`; `getAllPostSlugs` din `@/lib/blog`; `SITE_URL`
- Produces: `/sitemap.xml`, `/robots.txt`

- [ ] **Step 1: Scrie testul**

`src/__tests__/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

const entries = sitemap();
const urls = entries.map((entry) => entry.url);

describe("sitemap", () => {
  it("lists home, about, blog and all services in every locale", () => {
    for (const url of [
      "https://devopsflow.io",
      "https://devopsflow.io/ro",
      "https://devopsflow.io/ru/about",
      "https://devopsflow.io/blog",
      "https://devopsflow.io/services/ci-cd",
      "https://devopsflow.io/ro/services/kubernetes",
      "https://devopsflow.io/ru/services/consulting",
    ]) {
      expect(urls).toContain(url);
    }
  });

  it("lists the existing blog posts", () => {
    expect(urls).toContain("https://devopsflow.io/blog/getting-started-with-kubernetes");
    expect(urls).toContain("https://devopsflow.io/ro/blog/kubernetes-on-budget-rancher-rke2-hetzner");
  });

  it("omits the removed listing and contact pages", () => {
    expect(urls.filter((url) => /\/(services|contact)$/.test(url))).toEqual([]);
  });

  it("has no duplicates", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("attaches hreflang alternates to each entry", () => {
    const about = entries.find((entry) => entry.url === "https://devopsflow.io/ro/about");
    expect(about?.alternates?.languages).toEqual({
      en: "https://devopsflow.io/about",
      ro: "https://devopsflow.io/ro/about",
      ru: "https://devopsflow.io/ru/about",
      "x-default": "https://devopsflow.io/about",
    });
  });
});

describe("robots", () => {
  it("allows crawling and points to the sitemap", () => {
    const config = robots();
    expect(config.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(config.sitemap).toBe("https://devopsflow.io/sitemap.xml");
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/sitemap.test.ts`
Expected: FAIL, „Failed to resolve import "@/app/sitemap"”.

- [ ] **Step 3: Scrie `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import { getAllPostSlugs } from "@/lib/blog";

function entriesFor(path: string, locales: readonly Locale[]): MetadataRoute.Sitemap {
  const languages = languageAlternates(path, { absolute: true, locales });
  return locales.map((locale) => ({
    url: absoluteUrl(locale, path),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about",
    "/blog",
    ...services.map((service) => `/services/${service.slug}`),
  ];

  const localesBySlug = new Map<string, Locale[]>();
  for (const locale of routing.locales) {
    for (const slug of getAllPostSlugs(locale)) {
      localesBySlug.set(slug, [...(localesBySlug.get(slug) ?? []), locale]);
    }
  }

  return [
    ...staticPaths.flatMap((path) => entriesFor(path, routing.locales)),
    ...[...localesBySlug].flatMap(([slug, locales]) => entriesFor(`/blog/${slug}`, locales)),
  ];
}
```

- [ ] **Step 4: Scrie `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Rulează testele și comite**

Run: `npx vitest run src/__tests__/sitemap.test.ts && npm run type-check && npm run lint`
Expected: PASS.

```bash
git add src/app/sitemap.ts src/app/robots.ts src/__tests__/sitemap.test.ts
git commit -q -m "feat: add sitemap and robots"
```

---

### Task 7: Paginile de detaliu ale serviciilor

**Files:**
- Rewrite: `src/components/services/service-detail-hero.tsx`, `service-features.tsx`, `service-tools.tsx`, `related-services.tsx`, `src/app/[locale]/services/[slug]/page.tsx`, `src/__tests__/services.test.tsx`
- Create: `src/components/sections/cta-band.tsx`
- Modify: `src/lib/services.ts` (scoate `gradient`, `accentBg`)
- Delete: `src/components/services/service-card.tsx`, `src/components/sections/services-cta.tsx`, `services-grid.tsx`, `services-hero.tsx`, `src/app/[locale]/services/page.tsx`

**Interfaces:**
- Consumes: `getServiceBySlug`, `getRelatedServices`, `services` din `@/lib/services`; `pageMetadata`, `serviceJsonLd`, `breadcrumbJsonLd`, `absoluteUrl` din `@/lib/seo`
- Produces: `<ServiceDetailHero slug />`, `<ServiceFeatures slug />`, `<ServiceTools slug />`, `<RelatedServices currentSlug />`, `<CtaBand />`; `ServiceDefinition` devine `{ key: string; slug: string; icon: LucideIcon }`

- [ ] **Step 1: Rescrie testul `src/__tests__/services.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => (key.endsWith("_tools") ? "Terraform, Helm, ArgoCD" : key),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { services, getRelatedServices } from "@/lib/services";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceTools } from "@/components/services/service-tools";
import { RelatedServices } from "@/components/services/related-services";
import { CtaBand } from "@/components/sections/cta-band";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("service registry", () => {
  it("keeps the 8 services with unique slugs", () => {
    expect(services.length).toBe(8);
    expect(new Set(services.map((s) => s.slug)).size).toBe(8);
  });

  it("wraps around when picking related services", () => {
    expect(getRelatedServices("consulting").map((s) => s.slug)).toEqual(["ci-cd", "kubernetes", "cloud"]);
  });
});

describe("ServiceDetailHero", () => {
  it("renders one h1 and a link back to the services section", () => {
    const { container } = render(<ServiceDetailHero slug="kubernetes" />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(container.textContent).toContain("kubernetes_title");
    expect(hrefs(container)).toContain("/#services");
  });
});

describe("ServiceFeatures", () => {
  it("lists the four features", () => {
    const { container } = render(<ServiceFeatures slug="ci-cd" />);
    expect(container.querySelectorAll("li").length).toBe(4);
    expect(container.textContent).toContain("ci_cd_f4");
  });
});

describe("ServiceTools", () => {
  it("splits the comma-separated tools into separate items", () => {
    const { container } = render(<ServiceTools slug="cloud" />);
    const items = Array.from(container.querySelectorAll("li")).map((li) => li.textContent);
    expect(items).toEqual(["Terraform", "Helm", "ArgoCD"]);
  });
});

describe("RelatedServices", () => {
  it("links to three other services, never the current one", () => {
    const { container } = render(<RelatedServices currentSlug="linux" />);
    const links = hrefs(container);
    expect(links.length).toBe(3);
    expect(links).not.toContain("/services/linux");
  });
});

describe("CtaBand", () => {
  it("sends visitors to the contact section", () => {
    const { container } = render(<CtaBand />);
    expect(hrefs(container)).toEqual(["/#contact"]);
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/services.test.tsx`
Expected: FAIL, „Failed to resolve import "@/components/sections/cta-band"”.

- [ ] **Step 3: Simplifică `src/lib/services.ts`**

Șterge din interfață câmpurile `gradient` și `accentBg` și din fiecare obiect cele două linii corespunzătoare. Rezultatul pentru interfață și primul element:

```ts
export interface ServiceDefinition {
  key: string;
  slug: string;
  icon: LucideIcon;
}

export const services: ServiceDefinition[] = [
  { key: "ci_cd", slug: "ci-cd", icon: GitBranch },
  { key: "kubernetes", slug: "kubernetes", icon: Container },
  { key: "cloud", slug: "cloud", icon: Cloud },
  { key: "monitoring", slug: "monitoring", icon: Activity },
  { key: "security", slug: "security", icon: ShieldCheck },
  { key: "networking", slug: "networking", icon: Network },
  { key: "linux", slug: "linux", icon: Server },
  { key: "consulting", slug: "consulting", icon: MessagesSquare },
];
```

Funcțiile `getServiceBySlug` și `getRelatedServices` rămân neschimbate.

- [ ] **Step 4: Scrie `src/components/sections/cta-band.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaBand() {
  const t = useTranslations("ServicesPage");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="card-surface p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("cta_title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("cta_description")}</p>
        <Link href="/#contact" className="btn-primary mt-6">
          {t("cta_button")}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Rescrie cele patru componente din `src/components/services/`**

`service-detail-hero.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getServiceBySlug } from "@/lib/services";

export function ServiceDetailHero({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;
  const Icon = service.icon;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
      <Link
        href="/#services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("back_to_services")}
      </Link>
      <Icon className="mt-8 h-8 w-8 text-primary" aria-hidden="true" />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {t(`${service.key}_title`)}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {t(`${service.key}_desc`)}
      </p>
    </section>
  );
}
```

`service-features.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { getServiceBySlug } from "@/lib/services";

const FEATURES = ["f1", "f2", "f3", "f4"] as const;

export function ServiceFeatures({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("features_label")}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="card-surface flex gap-3 p-4 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {t(`${service.key}_${feature}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`service-tools.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { getServiceBySlug } from "@/lib/services";

export function ServiceTools({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;
  const tools = t(`${service.key}_tools`)
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("tools_label")}</h2>
      <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
        {tools.map((tool) => (
          <li key={tool} className="rounded-full border border-border px-3 py-1.5 text-muted-foreground">
            {tool}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`related-services.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getRelatedServices } from "@/lib/services";

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("ServicesPage");
  const related = getRelatedServices(currentSlug);

  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold">{t("related_services")}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {related.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="card-surface flex items-center gap-3 p-4 text-sm font-semibold transition-colors hover:border-primary"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {t(`${service.key}_title`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 6: Rescrie `src/app/[locale]/services/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { services, getServiceBySlug } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceTools } from "@/components/services/service-tools";
import { RelatedServices } from "@/components/services/related-services";
import { CtaBand } from "@/components/sections/cta-band";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return services.flatMap((service) =>
    routing.locales.map((locale) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return pageMetadata({
    locale: locale as Locale,
    path: `/services/${slug}`,
    title: t(`${service.key}_title`),
    description: t(`${service.key}_desc`),
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const name = t(`${service.key}_title`);

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          locale: locale as Locale,
          slug,
          name,
          description: t(`${service.key}_desc`),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "DevOpsFlow", url: absoluteUrl(locale as Locale, "/") },
          { name, url: absoluteUrl(locale as Locale, `/services/${slug}`) },
        ])}
      />
      <ServiceDetailHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServiceTools slug={slug} />
      <RelatedServices currentSlug={slug} />
      <CtaBand />
    </>
  );
}
```

- [ ] **Step 7: Șterge fișierele înlocuite**

```bash
git rm -q src/components/services/service-card.tsx src/components/sections/services-cta.tsx \
  src/components/sections/services-grid.tsx src/components/sections/services-hero.tsx \
  "src/app/[locale]/services/page.tsx"
grep -rn "service-card\|services-cta\|services-grid\|services-hero\|\.gradient\|accentBg" src || echo "no references"
```
Expected: `no references`.

- [ ] **Step 8: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS.

```bash
git add -A src
git commit -q -m "feat: restyle service detail pages and drop the listing page"
```

---

### Task 8: Pagina de contact dispare; redirecturi pentru URL-urile vechi

**Files:**
- Delete: `src/app/[locale]/contact/page.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: ancorele `#services` și `#contact` din Home (Task 5)
- Produces: redirecturi permanente de la `/services` și `/contact`, în toate limbile

- [ ] **Step 1: Șterge pagina de contact și confirmă că nu mai există linkuri spre paginile eliminate**

```bash
git rm -q "src/app/[locale]/contact/page.tsx"
grep -rnE 'href="/(contact|services)"' src || echo "no stale links"
```
Expected: apar doar potrivirile din `src/components/about/about-sections.tsx` (se repară în Task 9). Orice altă potrivire se corectează acum la `/#contact`, respectiv `/#services`.

- [ ] **Step 2: Adaugă redirecturile în `next.config.ts`**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/en/services", destination: "/#services", permanent: true },
      { source: "/en/contact", destination: "/#contact", permanent: true },
      { source: "/:locale(ro|ru)/services", destination: "/:locale#services", permanent: true },
      { source: "/:locale(ro|ru)/contact", destination: "/:locale#contact", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Construiește și verifică redirecturile pe serverul real**

```bash
npm run build
(npx next start -p 3100 >/dev/null 2>&1 &) ; sleep 4
for p in /services /contact /en/services /ro/services /ru/contact; do
  printf '%s -> ' "$p"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "http://localhost:3100$p"
done
curl -s -o /dev/null -w 'kubernetes -> %{http_code}\n' http://localhost:3100/services/kubernetes
pkill -f "next start -p 3100"
```

Expected:

```
/services -> 308 http://localhost:3100/#services
/contact -> 308 http://localhost:3100/#contact
/en/services -> 308 http://localhost:3100/#services
/ro/services -> 308 http://localhost:3100/ro#services
/ru/contact -> 308 http://localhost:3100/ru#contact
kubernetes -> 200
```

Dacă `redirect_url` apare fără fragmentul `#...`, oprește-te și raportează: înseamnă că Next.js elimină fragmentul din destinație și trebuie aleasă altă soluție împreună cu proprietarul.

- [ ] **Step 4: Comite**

```bash
npm run type-check && npm run lint && npm test
git add -A next.config.ts src
git commit -q -m "feat: redirect removed services and contact pages to home sections"
```

---

### Task 9: Pagina About (fără animații, fără STM Telecom)

**Files:**
- Modify: `src/components/about/about-sections.tsx`, `src/app/[locale]/about/page.tsx`, `messages/en.json`, `messages/ro.json`, `messages/ru.json`, `src/__tests__/messages.test.ts`
- Test: `src/__tests__/about.test.tsx`

**Interfaces:**
- Consumes: `pageMetadata` din `@/lib/seo`
- Produces: aceleași exporturi ca până acum (`AboutHero`, `AboutCompany`, `AboutFounder`, `AboutTimeline`, `AboutCertifications`, `AboutProcess`, `AboutValues`, `AboutCTA`), acum Server Components

- [ ] **Step 1: Scrie testul**

`src/__tests__/about.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { AboutHero, AboutTimeline, AboutCTA } from "@/components/about/about-sections";

describe("AboutHero", () => {
  it("renders the page h1", () => {
    const { container } = render(<AboutHero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
  });
});

describe("AboutTimeline", () => {
  it("omits STM Telecom and keeps the other employers", () => {
    const { container } = render(<AboutTimeline />);
    expect(container.textContent).not.toContain("tl_stm");
    for (const key of ["moldtelecom", "orange", "saltedge", "gilat", "alexhost", "ebs", "duocircle", "skynet"]) {
      expect(container.textContent).toContain(`tl_${key}_company`);
    }
  });
});

describe("AboutCTA", () => {
  it("links to home sections instead of the removed pages", () => {
    const { container } = render(<AboutCTA />);
    const links = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("/#contact");
    expect(links).not.toContain("/contact");
    expect(links).not.toContain("/services");
  });
});
```

În `src/__tests__/messages.test.ts`, adaugă în `describe("translation files", ...)`:

```ts
  it("no longer mention STM Telecom", () => {
    for (const list of [keys.en, keys.ro, keys.ru]) {
      expect(list.filter((key) => key.includes("tl_stm_"))).toEqual([]);
    }
    expect(JSON.stringify([en, ro, ru])).not.toContain("STM");
  });
```

- [ ] **Step 2: Rulează testele și confirmă că pică**

Run: `npx vitest run src/__tests__/about.test.tsx src/__tests__/messages.test.ts`
Expected: FAIL la „omits STM Telecom”, „links to home sections” și „no longer mention STM Telecom”.

- [ ] **Step 3: Transformă `about-sections.tsx` în Server Component**

```bash
perl -0pi -e '
  s/<(\/?)motion\.(\w+)/<$1$2/g;
  s/^\s*(?:variants|initial|whileInView|animate|viewport|transition)=(?:\{\{[^\n]*\}\}|\{[^\n{}]*\}|"[^"\n]*")\n//mg;
  s/\s(?:variants|initial|whileInView|animate)=(?:\{[A-Za-z]+\}|"[a-z]+")//g;
  s#href="/contact"#href="/\#contact"#g;
  s#href="/services"#href="/\#services"#g;
  s/"moldtelecom", "stm", "orange"/"moldtelecom", "orange"/;
' src/components/about/about-sections.tsx
```

Apoi, manual, în același fișier:
- șterge prima linie `"use client";`
- șterge linia `import { motion } from "framer-motion";`
- șterge integral constantele `fadeUp`, `stagger` și `staggerItem` (și comentariul „Animation variants”)
- pe fiecare iconiță Lucide redată în JSX care nu are încă `aria-hidden`, adaugă `aria-hidden="true"`

Verificare:

```bash
grep -n "motion\|use client\|fadeUp\|stagger\|\"stm\"" src/components/about/about-sections.tsx || echo "clean"
```
Expected: `clean`. Dacă `npm run lint` raportează importuri Lucide nefolosite, șterge-le din lista de import.

- [ ] **Step 4: Șterge cheile STM din traduceri**

În `messages/en.json`, `messages/ro.json` și `messages/ru.json`, șterge din `AboutPage` cele patru chei: `tl_stm_date`, `tl_stm_company`, `tl_stm_role`, `tl_stm_desc`.

```bash
grep -n "stm\|STM" messages/*.json || echo "no STM"
```
Expected: `no STM`. Dacă apare „STM” în alt text (de exemplu într-un paragraf despre fondator), rescrie fraza fără acea mențiune, în toate cele trei limbi.

- [ ] **Step 5: Adaugă metadate în `src/app/[locale]/about/page.tsx`**

Adaugă importurile și funcția deasupra componentei existente (corpul `AboutPage` rămâne neschimbat):

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return pageMetadata({
    locale: locale as Locale,
    path: "/about",
    title: t("founder_name"),
    description: t("hero_subtitle"),
  });
}
```

Șterge vechiul `import { setRequestLocale } from "next-intl/server";`, acum duplicat.

- [ ] **Step 6: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS.

```bash
git add -A src messages
git commit -q -m "feat: make about page static and remove STM Telecom"
```

---

### Task 10: Blog, 404 localizat, imagine Open Graph

**Files:**
- Rewrite: `src/components/blog/blog-card.tsx`, `src/components/blog/blog-listing-section.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`, `src/middleware.ts`
- Create: `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/opengraph-image.tsx`
- Test: `src/__tests__/blog.test.tsx` (existent, trebuie să treacă neschimbat), `src/__tests__/not-found.test.tsx`

**Interfaces:**
- Consumes: `pageMetadata`, `blogPostingJsonLd` din `@/lib/seo`; `getAllPostSlugs` din `@/lib/blog`; `routing`
- Produces: `<BlogCard post />`, `<BlogListingSection posts />` (aceleași props); pagină 404 localizată; `/opengraph-image` per limbă

- [ ] **Step 1: Scrie testul pentru 404**

`src/__tests__/not-found.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import NotFound from "@/app/[locale]/not-found";

describe("NotFound", () => {
  it("renders a localized heading and a link home", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("h1")?.textContent).toBe("title");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/");
  });
});
```

- [ ] **Step 2: Rulează testul și confirmă că pică**

Run: `npx vitest run src/__tests__/not-found.test.tsx`
Expected: FAIL, „Failed to resolve import "@/app/[locale]/not-found"”.

- [ ] **Step 3: Scrie pagina 404 și ruta catch-all**

`src/app/[locale]/not-found.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-gradient font-mono text-sm font-bold">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("cta")}
      </Link>
    </section>
  );
}
```

`src/app/[locale]/[...rest]/page.tsx`:

```tsx
import { notFound } from "next/navigation";

export default function CatchAllPage() {
  notFound();
}
```

- [ ] **Step 4: Rescrie componentele de blog ca Server Components**

`src/components/blog/blog-card.tsx`:

```tsx
import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations("Blog");
  const { slug, frontmatter, readingTime } = post;

  return (
    <Link
      href={`/blog/${slug}`}
      className="card-surface block h-full p-6 transition-colors hover:border-primary"
    >
      <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        {frontmatter.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-border px-2.5 py-0.5">
            {tag}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 text-lg font-bold leading-snug">{frontmatter.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {frontmatter.description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={frontmatter.date}>{frontmatter.date}</time>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {readingTime} {t("min_read")}
        </span>
      </div>
    </Link>
  );
}
```

`src/components/blog/blog-listing-section.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/blog";

interface BlogListingSectionProps {
  posts: BlogPost[];
}

export function BlogListingSection({ posts }: BlogListingSectionProps) {
  const t = useTranslations("Blog");

  if (posts.length === 0) {
    return <p className="text-center text-lg text-muted-foreground">{t("no_posts")}</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Metadate pentru lista de blog**

În `src/app/[locale]/blog/page.tsx`, înlocuiește `generateMetadata` și adaugă importurile:

```tsx
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return pageMetadata({
    locale: locale as Locale,
    path: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}
```

În același fișier, înlocuiește clasa etichetei `text-sm font-semibold uppercase tracking-wider text-primary` cu `eyebrow` și `max-w-7xl` cu `max-w-6xl`.

- [ ] **Step 6: Metadate și JSON-LD pentru articol**

În `src/app/[locale]/blog/[slug]/page.tsx`:

Adaugă importurile:

```tsx
import type { Metadata } from "next";
import { blogPostingJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
```

Înlocuiește `generateMetadata`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale as Locale);
  if (!post) return {};

  return pageMetadata({
    locale: locale as Locale,
    path: `/blog/${slug}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    locales: routing.locales.filter((l) => getAllPostSlugs(l).includes(slug)),
  });
}
```

În JSX, imediat după `<div className="mx-auto max-w-3xl ...">`, adaugă:

```tsx
      <JsonLd
        data={blogPostingJsonLd({
          locale: locale as Locale,
          slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          date: post.frontmatter.date,
          author: post.frontmatter.author,
        })}
      />
```

Înlocuiește expresia de localizare a datei `locale === "ro" ? "ro-RO" : "en-US"` cu `locale`, și adaugă `aria-hidden="true"` pe iconițele `ArrowLeft`, `Tag`, `Calendar` și `Clock`.

- [ ] **Step 7: Imaginea Open Graph**

`src/app/[locale]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const alt = "DevOpsFlow — Maxim Cujba, Senior DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only text on purpose: the default font has no Cyrillic glyphs.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f0f11",
          color: "#f6f5f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              marginRight: 18,
              backgroundImage: "linear-gradient(90deg, #f0060b, #cc26d5, #7702ff)",
            }}
          />
          DevOpsFlow
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            Reliability meets delivery speed
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#a3a2a9" }}>
            Maxim Cujba · Senior DevOps Engineer · Kubernetes · CI/CD · Cloud
          </div>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 5,
            backgroundImage: "linear-gradient(90deg, #f0060b, #cc26d5, #7702ff)",
          }}
        />
      </div>
    ),
    size,
  );
}
```

În `src/middleware.ts`, exclude imaginea din middleware-ul de limbă, ca URL-ul ei să răspundă direct:

```ts
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*opengraph-image.*|.*\\..*).*)",
};
```

- [ ] **Step 8: Verifică pe serverul real**

```bash
npm run type-check && npm run lint && npm test && npm run build
(npx next start -p 3100 >/dev/null 2>&1 &) ; sleep 4
curl -s -o /dev/null -w 'ro 404 -> %{http_code}\n' http://localhost:3100/ro/nu-exista
curl -s http://localhost:3100/ro/nu-exista | grep -c "Pagina nu a fost găsită"
OG=$(curl -s http://localhost:3100/ | grep -o 'property="og:image" content="[^"]*"' | head -1 | sed 's/.*content="//; s/"$//')
echo "og:image = $OG"
curl -s -o /dev/null -w 'og -> %{http_code} %{content_type}\n' "$(echo "$OG" | sed 's#https://devopsflow.io#http://localhost:3100#')"
pkill -f "next start -p 3100"
```

Expected: `ro 404 -> 404`; numărul de potriviri ≥ 1; `og:image` e un URL absolut pe `https://devopsflow.io/`; `og -> 200 image/png`.

- [ ] **Step 9: Comite**

```bash
git add -A src
git commit -q -m "feat: add blog metadata, localized 404 and Open Graph image"
```

---

### Task 11: Curățenie finală și documentație

**Files:**
- Modify: `package.json`, `package-lock.json`, `src/__tests__/setup.ts`, `CLAUDE.md`

**Interfaces:**
- Consumes: toate task-urile anterioare
- Produces: nicio referință la `framer-motion`; `CLAUDE.md` descrie starea reală

- [ ] **Step 1: Confirmă că Framer Motion nu mai e folosit și elimină-l**

```bash
grep -rn "framer-motion" src || echo "unused"
npm uninstall framer-motion
```
Expected: `unused`, apoi dezinstalare reușită.

- [ ] **Step 2: Confirmă lista de componente client**

```bash
grep -rl '"use client"' src | sort
```
Expected, exact:

```
src/components/contact/contact-form.tsx
src/components/layout/language-switcher.tsx
src/components/layout/theme-toggle.tsx
src/components/theme-provider.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/label.tsx
src/components/ui/separator.tsx
src/components/ui/sheet.tsx
```

Orice alt fișier din listă încalcă constrângerea globală și trebuie convertit.

- [ ] **Step 3: Corectează comentariul din `src/__tests__/setup.ts`**

Înlocuiește comentariul `// Polyfill IntersectionObserver for Framer Motion's whileInView` cu `// Polyfill IntersectionObserver (not implemented by jsdom)`.

- [ ] **Step 4: Actualizează `CLAUDE.md`**

- În „Tech Stack”: `Next.js 15` devine `Next.js 16`; linia despre Framer Motion se înlocuiește cu `- Animații: doar tranziții CSS (dezactivate sub prefers-reduced-motion); fără Framer Motion`.
- În „Structura Proiectului”: înlocuiește arborele `src/app/[locale]/` și `src/components/` cu structura reală:

```
src/
├── app/
│   ├── sitemap.ts, robots.ts            # SEO, generate din cod
│   └── [locale]/
│       ├── layout.tsx                   # Fonturi, metadataBase, SideRail + TopBar + Footer
│       ├── page.tsx                     # Home: carte de vizită (hero, cod, cifre, servicii, despre, proces, contact)
│       ├── services/[slug]/page.tsx     # 8 servicii × 3 limbi
│       ├── about/page.tsx
│       ├── blog/page.tsx, blog/[slug]/page.tsx
│       ├── not-found.tsx, [...rest]/page.tsx   # 404 localizat
│       └── opengraph-image.tsx
├── components/
│   ├── layout/        # side-rail, top-bar, footer, language-switcher, theme-toggle
│   ├── sections/      # hero, code-window, proof, services, about-teaser, process, contact, cta-band
│   ├── services/      # service-detail-hero, service-features, service-tools, related-services
│   ├── about/, blog/, contact/, ui/
│   ├── json-ld.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── site.ts        # Constante: URL, contact, cifre, certificări, navigare
│   ├── seo.ts         # Căi localizate, pageMetadata, constructori JSON-LD
│   ├── services.ts    # Registrul celor 8 servicii (key, slug, icon)
│   └── blog.ts, mdx-components.tsx, utils.ts
```

- În „Convenții → Cod”: înlocuiește linia despre Framer Motion cu `- Server Components implicit; "use client" doar pentru meniul mobil (ui/sheet), comutatoarele de temă/limbă și formularul de contact`.
- În „Services Architecture”: „Fiecare serviciu are: key, slug, icon”; adaugă `- Nu există pagină /services sau /contact: ambele redirecționează (308) la /#services și /#contact`.
- Adaugă o secțiune nouă:

```markdown
### SEO
- Orice pagină nouă își definește metadatele cu `pageMetadata()` din `src/lib/seo.ts` (canonical, hreflang, Open Graph)
- Orice rută nouă se adaugă în `src/app/sitemap.ts`
- JSON-LD se redă doar prin `<JsonLd data={...} />`
- Cifrele și certificările afișate vin din `src/lib/site.ts`; nu se adaugă altele fără confirmarea proprietarului
```

- [ ] **Step 5: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS.

```bash
git add -A package.json package-lock.json src CLAUDE.md
git commit -q -m "chore: remove framer-motion and document the new structure"
```

---

### Task 12: Verificare finală pe build-ul de producție

Niciun fișier modificat, în afară de eventualele corecturi cerute de rezultate.

- [ ] **Step 1: Build și pornire**

```bash
npm run build
(npx next start -p 3100 >/dev/null 2>&1 &) ; sleep 4
```
Expected: build fără erori și fără avertismente de mesaje lipsă.

- [ ] **Step 2: Conținutul există fără JavaScript, în toate limbile**

```bash
for l in "" /ro /ru; do
  H=$(curl -s "http://localhost:3100$l/")
  printf '%s: h1=%s stats=%s jsonld=%s canonical=%s hreflang=%s\n' "${l:-/en}" \
    "$(echo "$H" | grep -o '<h1' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o '99\.9%' | head -1)" \
    "$(echo "$H" | grep -o 'application/ld+json' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o 'rel="canonical"' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o 'hrefLang=\|hreflang=' | wc -l | tr -d ' ')"
done
```
Expected, pe fiecare linie: `h1=1 stats=99.9% canonical=1 hreflang=4` și `jsonld` cel puțin 2 (payload-ul RSC poate repeta șirul).

- [ ] **Step 3: Sitemap, robots și absența STM**

```bash
curl -s http://localhost:3100/robots.txt
curl -s http://localhost:3100/sitemap.xml | grep -c "<loc>"
curl -s http://localhost:3100/about http://localhost:3100/ro/about http://localhost:3100/ru/about | grep -ci "stm telecom"
```
Expected: `robots.txt` conține `Sitemap: https://devopsflow.io/sitemap.xml`; 39 de `<loc>` (11 rute × 3 limbi + 2 articole × 3 limbi); `0` mențiuni STM.

- [ ] **Step 4: Lighthouse mobil**

Acest pas descarcă Lighthouse în cache-ul `npx` (fără instalare globală) și folosește Chrome-ul local. Cere acordul proprietarului înainte de rulare.

```bash
npx --yes lighthouse@12 http://localhost:3100/ --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-home.json --quiet
node -e 'const c=require("/tmp/lh-home.json").categories;for(const k in c)console.log(k,Math.round(c[k].score*100))'
```
Expected: `performance ≥ 95`, `accessibility ≥ 95`, `best-practices ≥ 95`, `seo 100`. Repetă pentru `/ru/` și `/services/kubernetes`.

Scorul SEO rulat pe `localhost` poate penaliza canonical-ul care indică `devopsflow.io`; dacă acesta e singurul audit SEO picat, notează-l și nu-l trata ca defect. Pentru orice alt scor sub prag: citește auditurile picate din JSON, corectează cauza și rulează din nou.

- [ ] **Step 5: Oprește serverul și construiește imaginea Docker**

```bash
pkill -f "next start -p 3100"
docker build --target runner -t devopsflow:redesign .
```
Expected: build reușit (etapa `test` din Dockerfile rulează type-check, lint și teste).

- [ ] **Step 6: Raportează**

Raportează proprietarului: scorurile Lighthouse pe cele trei pagini, rezultatele pașilor 2–3, lista commit-urilor de pe `feat/redesign` și cele trei abateri de la spec. Nu face merge, push sau deploy.
