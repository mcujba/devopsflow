# Skeuomorphic Rack Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Înlocuiește stratul vizual al devopsflow.io cu un rack din email crem, cu text în relief și un singur accent roșu, fără niciun element din vechiul design.

**Architecture:** Un set mic de primitive (`Unit`, `FaceplateStrip`, `Lcd`, `PortLink`) plus clase CSS de material definite o singură dată în `globals.css`. Fiecare secțiune a paginii devine un modul de rack construit din aceste primitive. Tema unică elimină `next-themes`; navigarea în antet elimină meniul lateral, astfel că rămân client doar comutatorul de limbă și formularul.

**Tech Stack:** Next.js 16.4 App Router, React 19, TypeScript 6, Tailwind 4, next-intl 4, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-09-skeuomorphic-redesign-design.md` · Mockup aprobat: `docs/superpowers/specs/2026-10-09-skeuomorphic-mockup.html`

## Global Constraints

- Branch `feat/skeuomorphic`. Fără merge, fără deploy; push și PR doar la cererea proprietarului.
- Dependențe noi: niciuna.
- Neschimbate funcțional: `src/app/actions/contact.ts`, logica de captcha din `contact-form.tsx` (efectul `turnstile.render`/`remove`, `Script`, `formKey`), `src/lib/blog.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/proxy.ts`, `next.config.ts`, `Dockerfile`, workflow-ul CI.
- URL-urile și ancorele rămân: `#services`, `#about`, `#process`, `#contact`; se adaugă `#blog`.
- Limbi `en`, `ro`, `ru`; orice cheie nouă există în toate cele trei fișiere din `messages/`.
- Cifre permise, exact: `10+`, `10M+`, `60%` (pe afișaj `−60%`), `99.9%`.
- O singură temă. Un singur accent de culoare (roșu).
- Interzis în cod: `text-gradient`, `bg-gradient-solid`, `backdrop-blur`, `next-themes`, `Inter_Tight`, `rounded-full` pe butoane și linkuri.
- Componente client permise: `layout/language-switcher.tsx`, `contact/contact-form.tsx`.
- Un singur `<h1>` pe pagină. Elementele decorative (porturi, LED-uri, găuri) au `aria-hidden="true"`.
- Commit-uri convenționale, încheiate cu `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- După fiecare task: `npm run type-check && npm run lint && npm test` trec.

**Abateri deliberate de la spec (de confirmat la revizuire):**
- **Antetul e un modul subțire propriu**, randat o singură dată în layout, deasupra primului modul al fiecărei pagini. Spec-ul îl descria ca bandă în interiorul primului modul; ca modul separat de 1U arată la fel de autentic și nu trebuie repetat în fiecare pagină.
- **Roșul pentru text este `#a8321a`**, iar tasta roșie merge de la `#b93d24` la `#9c2c15`. Valorile din spec (`#b5391f`, respectiv `#c8452a`) dau contrast de 4.3–4.4:1 pe capătul închis al gradientului de email și cu textul crem al tastei, sub pragul AA.
- **Dispar și componentele shadcn rămase nefolosite** (`ui/*`, `lib/utils.ts`, `components.json`) împreună cu dependențele lor (`radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `shadcn`, `tw-animate-css`). Spec-ul enumera doar o parte.

## Review Focus

1. **Derulare orizontală pe telefon** în RO și RU, unde cuvintele sunt mai lungi (titlul, etichetele porturilor, tastele). (Task 7, verificare la 360px în toate limbile.)
2. **Contrast ridicat forțat**: tastele, câmpurile și sloturile trebuie să rămână vizibile fără umbre și gradienturi. (Task 7, verificare cu `forced-colors`.)
3. **Captcha după redesign**: formularul e restilizat, dar trebuie să apară în continuare și după navigare în site. (Task 2 păstrează testele existente; Task 7 verifică în browser.)
4. **Limbă fără articole**: modulul de blog de pe Home nu are voie să lase o tavă goală. (Task 2, test.)
5. **Rămășițe din vechiul design** care ar readuce aspectul generic. (Task 6, test care scanează sursa.)

---

## Harta fișierelor

| Fișier | Acțiune |
|---|---|
| `src/app/globals.css` | rescris: tokenuri și clase de material |
| `src/app/[locale]/layout.tsx` | fonturi noi, fără temă, antet + subsol |
| `src/components/rack/{unit,faceplate-strip,lcd,port}.tsx` | nou |
| `src/components/layout/{language-switcher,footer}.tsx` | rescris |
| `src/components/sections/{hero,services,about-teaser,process,contact,cta-band}.tsx` | rescris |
| `src/components/sections/blog-tray.tsx` | nou |
| `src/components/contact/contact-form.tsx` | restilizat (logică neatinsă) |
| `src/components/services/*`, `src/components/about/about-sections.tsx`, `src/components/blog/*` | rescris |
| `src/lib/mdx-components.tsx`, `src/lib/site.ts` | modificat |
| `src/app/[locale]/{page,not-found,opengraph-image}.tsx`, `services/[slug]/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx` | modificat |
| `messages/{en,ro,ru}.json` | texte noi, chei vechi șterse |
| `docs/blog-authoring.md` | nou |
| Șterse | `components/theme-provider.tsx`, `layout/{theme-toggle,side-rail,top-bar}.tsx`, `sections/{code-window,proof}.tsx`, `components/ui/*`, `lib/utils.ts`, `components.json` |

---

### Task 1: Materialul și scheletul (CSS, fonturi, antet, subsol)

**Files:**
- Rewrite: `src/app/globals.css`, `src/components/layout/language-switcher.tsx`, `src/components/layout/footer.tsx`, `src/__tests__/shell.test.tsx`
- Create: `src/components/rack/unit.tsx`, `src/components/rack/faceplate-strip.tsx`, `src/components/rack/lcd.tsx`, `src/components/rack/port.tsx`, `src/__tests__/rack.test.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Delete: `src/components/theme-provider.tsx`, `src/components/layout/theme-toggle.tsx`, `src/components/layout/side-rail.tsx`, `src/components/layout/top-bar.tsx`, `src/components/ui/sheet.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `CERTIFICATIONS` din `@/lib/site`; `services` din `@/lib/services`
- Produces:
  - `<Unit id? className? labelledBy?>children</Unit>` din `@/components/rack/unit`
  - `<FaceplateStrip />` din `@/components/rack/faceplate-strip`
  - `<Lcd items={[{ label: string; value: string }]} />` din `@/components/rack/lcd`
  - `<Socket />` și `<PortLink href label />` din `@/components/rack/port`
  - Clase CSS: `unit`, `unit-face`, `unit-1u`, `engraved`, `label-red`, `relief`, `display`, `key`, `key-red`, `lcd`, `socket`, `led`, `raised`, `inset`, `sheet`, `field`, `ledger`, `stamp`, `tag`, `on-desk`

- [ ] **Step 1: Scrie testele**

`src/__tests__/rack.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { render } from "@testing-library/react";
import { Unit } from "@/components/rack/unit";
import { Lcd } from "@/components/rack/lcd";
import { PortLink } from "@/components/rack/port";

describe("Unit", () => {
  it("renders a section with its anchor id and hides the mounting ears from assistive tech", () => {
    const { container } = render(
      <Unit id="services">
        <p>content</p>
      </Unit>,
    );
    const section = container.querySelector("section");
    expect(section?.id).toBe("services");
    expect(section?.textContent).toBe("content");
    for (const ear of container.querySelectorAll(".ear")) {
      expect(ear.getAttribute("aria-hidden")).toBe("true");
    }
  });
});

describe("Lcd", () => {
  it("exposes each reading as a real term and value pair", () => {
    const { container } = render(
      <Lcd
        items={[
          { label: "UPTIME SLA", value: "99.9%" },
          { label: "YEARS", value: "10+" },
        ]}
      />,
    );
    expect(container.querySelector("dl")).not.toBeNull();
    expect(Array.from(container.querySelectorAll("dt")).map((n) => n.textContent)).toEqual(["UPTIME SLA", "YEARS"]);
    expect(Array.from(container.querySelectorAll("dd")).map((n) => n.textContent)).toEqual(["99.9%", "10+"]);
  });
});

describe("PortLink", () => {
  it("is a link named by its visible label, with a decorative socket", () => {
    const { container } = render(<PortLink href="/services/kubernetes" label="K8s" />);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/services/kubernetes");
    expect(link?.textContent).toBe("K8s");
    expect(container.querySelector(".socket")?.getAttribute("aria-hidden")).toBe("true");
  });
});
```

Înlocuiește integral `src/__tests__/shell.test.tsx`:

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
import { FaceplateStrip } from "@/components/rack/faceplate-strip";
import { Footer } from "@/components/layout/footer";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

describe("FaceplateStrip", () => {
  it("links to home sections with absolute anchors so they work from inner pages", () => {
    const { container } = render(<FaceplateStrip />);
    const links = hrefs(container);
    expect(links).toEqual(expect.arrayContaining(["/", "/#services", "/about", "/blog", "/#contact"]));
    expect(links).not.toContain("#services");
  });

  it("labels the navigation landmark in the visitor's language", () => {
    const { container } = render(<FaceplateStrip />);
    expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("main_label");
  });

  it("offers the three languages as keys, with the current one pressed", () => {
    const { container } = render(<FaceplateStrip />);
    const keys = Array.from(container.querySelectorAll('[role="radio"]'));
    expect(keys.map((k) => k.textContent)).toEqual(["en", "ro", "ru"]);
    expect(keys.map((k) => k.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
  });

  it("has no theme toggle", () => {
    const { container } = render(<FaceplateStrip />);
    expect(container.querySelectorAll("button").length).toBe(3);
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

- [ ] **Step 2: Rulează testele și confirmă că pică**

Run: `npx vitest run src/__tests__/rack.test.tsx src/__tests__/shell.test.tsx`
Expected: FAIL, „Failed to resolve import "@/components/rack/unit"” și „"@/components/rack/faceplate-strip"”.

- [ ] **Step 3: Rescrie `src/app/globals.css`**

Înlocuiește tot conținutul fișierului cu:

```css
@import "tailwindcss";

@source not "../../src/content";

@plugin "@tailwindcss/typography";

@theme {
  --color-desk: #23282b;
  --color-desk-ink: #e9e2d2;
  --color-desk-muted: #a9a294;
  --color-enamel: #ece5d5;
  --color-paper: #fbf8f0;
  --color-well: #d7cfbd;
  --color-ink: #2b2722;
  --color-ink-muted: #5f574b;
  --color-red: #a8321a;
  --color-lcd: #c9cdb6;
  --color-lcd-ink: #1f2318;
  --color-socket: #121416;
  --color-edge: #b3aa96;
  --font-display: var(--font-playfair), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-jost), system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
}

:root {
  --noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --noise-soft: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --relief: 0 1px 0 rgb(255 255 255 / 0.8);
  --shadow-unit:
    inset 0 1px 0 rgb(255 255 255 / 0.8), inset 0 -2px 0 rgb(0 0 0 / 0.14),
    0 1px 1px rgb(0 0 0 / 0.4), 0 14px 26px rgb(0 0 0 / 0.45);
  --shadow-raised: inset 0 1px 0 #fff, 0 2px 3px rgb(0 0 0 / 0.18);
  --shadow-inset: inset 0 3px 6px rgb(0 0 0 / 0.35), 0 1px 0 rgb(255 255 255 / 0.85);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-desk);
    background-image: var(--noise);
    color: var(--color-ink);
    font-family: var(--font-sans);
  }
  section[id] {
    scroll-margin-top: 1rem;
  }
  :where(a, button, input, textarea, [role="radio"]):focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }
  .on-desk :where(a, button):focus-visible {
    outline-color: var(--color-desk-ink);
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
  /* ── Rack unit ─────────────────────────────── */
  .unit {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    border: 1px solid var(--color-edge);
    border-radius: 6px;
    background-color: var(--color-enamel);
    background-image: var(--noise-soft), linear-gradient(#f3eddf, #e4dccb);
    box-shadow: var(--shadow-unit);
  }
  .unit-face {
    min-width: 0;
    padding: 1.25rem 1rem 1.5rem;
  }
  .unit-1u .unit-face {
    padding-block: 0.625rem;
  }
  .ear {
    display: none;
  }
  @media (min-width: 1024px) {
    .unit {
      grid-template-columns: 30px minmax(0, 1fr) 30px;
    }
    .unit-face {
      padding: 1.5rem 1.75rem 1.75rem;
    }
    .unit-1u .unit-face {
      padding-block: 0.75rem;
    }
    .ear {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding-block: 0.875rem;
      border-right: 1px solid rgb(43 39 34 / 0.16);
      box-shadow: 1px 0 0 rgb(255 255 255 / 0.6);
    }
    .ear-right {
      border-right: 0;
      border-left: 1px solid rgb(43 39 34 / 0.16);
      box-shadow: -1px 0 0 rgb(255 255 255 / 0.6);
    }
    .ear-hole {
      width: 12px;
      height: 18px;
      border-radius: 6px;
      background: var(--color-socket);
      box-shadow: inset 0 2px 3px rgb(0 0 0 / 0.9), 0 1px 0 rgb(255 255 255 / 0.75);
    }
  }

  /* ── Lettering ─────────────────────────────── */
  .relief {
    text-shadow: var(--relief);
  }
  .display {
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: -0.01em;
    text-shadow: var(--relief), 0 -1px 0 rgb(0 0 0 / 0.16);
  }
  .display em {
    font-style: italic;
    font-weight: 500;
    color: var(--color-red);
  }
  .engraved {
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--color-ink-muted);
    text-shadow: var(--relief);
  }
  .label-red {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--color-red);
    text-shadow: var(--relief);
  }

  /* ── Controls ──────────────────────────────── */
  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding-inline: 0.75rem;
    border: 1px solid #a39a87;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-ink);
    background: linear-gradient(#fbf7ee, #dcd4c2);
    box-shadow: inset 0 1px 0 #fff, 0 2px 0 #a39a87, 0 3px 4px rgb(0 0 0 / 0.25);
    transition: transform 80ms, box-shadow 80ms;
  }
  .key:active,
  .key[aria-checked="true"] {
    transform: translateY(2px);
    background: linear-gradient(#cfc7b5, #ddd5c4);
    box-shadow: inset 0 2px 3px rgb(0 0 0 / 0.35);
    color: var(--color-red);
  }
  .key-red {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    padding: 0.875rem 1.375rem;
    border: 1px solid #6c1d0c;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-align: center;
    color: #fbf3e6;
    text-shadow: 0 -1px 0 rgb(0 0 0 / 0.35);
    background: linear-gradient(#b93d24, #9c2c15);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -2px 0 rgb(0 0 0 / 0.22),
      0 3px 0 #6c1d0c, 0 6px 8px rgb(0 0 0 / 0.35);
    transition: transform 80ms, box-shadow 80ms;
  }
  .key-red:active {
    transform: translateY(3px);
    box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.4);
  }
  .key-red:disabled {
    opacity: 0.6;
  }
  .led {
    display: inline-block;
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #b9b1a1;
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.5), 0 1px 0 rgb(255 255 255 / 0.8);
    transition: background-color 120ms, box-shadow 120ms;
  }
  a:hover > .led,
  a:focus-visible > .led,
  .led-on {
    background: radial-gradient(circle at 35% 30%, #ffd9cf, #e04a2a 45%, #8e2410);
    box-shadow: 0 0 7px 1px rgb(224 74 42 / 0.55), 0 1px 0 rgb(255 255 255 / 0.8);
  }

  /* ── Surfaces ──────────────────────────────── */
  .lcd {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem 1rem;
    margin: 0;
    padding: 0.875rem 1rem;
    border: 1px solid rgb(43 39 34 / 0.45);
    border-radius: 5px;
    font-family: var(--font-mono);
    color: var(--color-lcd-ink);
    background: linear-gradient(#b9bea6, var(--color-lcd));
    box-shadow: inset 0 3px 7px rgb(0 0 0 / 0.45), 0 1px 0 2px rgb(255 255 255 / 0.8);
  }
  .lcd dt {
    font-size: 0.625rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .lcd dd {
    margin: 0;
    font-size: 1.625rem;
    line-height: 1.15;
    letter-spacing: 0.02em;
  }
  .socket {
    position: relative;
    display: block;
    height: 2rem;
    border-radius: 3px;
    background: var(--color-socket);
    box-shadow:
      inset 0 3px 5px rgb(0 0 0 / 0.95), 0 1px 0 rgb(255 255 255 / 0.85),
      0 0 0 1px rgb(43 39 34 / 0.3);
  }
  .socket::before {
    content: "";
    position: absolute;
    left: 22%;
    right: 22%;
    bottom: 0;
    height: 8px;
    border-radius: 2px 2px 0 0;
    background: #23272a;
  }
  .socket::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 5px;
    width: 5px;
    height: 5px;
    border-radius: 1px;
    background: #e04a2a;
    box-shadow: 0 0 5px rgb(224 74 42 / 0.8);
  }
  .raised {
    border: 1px solid rgb(43 39 34 / 0.2);
    border-radius: 4px;
    background: linear-gradient(#f6f1e5, #e9e2d2);
    box-shadow: var(--shadow-raised);
    transition: transform 80ms, box-shadow 80ms;
  }
  a.raised:active {
    transform: translateY(1px);
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.25);
  }
  .inset {
    border: 1px solid rgb(43 39 34 / 0.25);
    border-radius: 4px;
    background: linear-gradient(#d2cab8, #ddd5c4);
    box-shadow: var(--shadow-inset);
  }
  .sheet {
    border: 1px solid rgb(43 39 34 / 0.18);
    border-radius: 2px;
    background: var(--color-paper);
    box-shadow: 0 1px 1px rgb(0 0 0 / 0.3), 0 4px 8px rgb(0 0 0 / 0.2);
  }
  .field {
    display: block;
    width: 100%;
    min-height: 2.75rem;
    padding: 0.625rem 0.75rem;
    border: 1px solid rgb(43 39 34 / 0.45);
    border-radius: 3px;
    font-size: 1rem;
    color: var(--color-ink);
    background: #f4efe3;
    box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.22), 0 1px 0 rgb(255 255 255 / 0.85);
  }
  .field:disabled {
    opacity: 0.6;
  }
  .ledger > * {
    border-bottom: 1px solid rgb(43 39 34 / 0.18);
    box-shadow: 0 1px 0 rgb(255 255 255 / 0.6);
  }
  .stamp {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 2px solid var(--color-red);
    border-radius: 50%;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-red);
    transform: rotate(-8deg);
  }
  .tag {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border: 1px solid rgb(43 39 34 / 0.3);
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--color-ink-muted);
  }
}

/* ── Code blocks: one dark theme ─────────────── */
pre.shiki {
  background-color: var(--color-socket) !important;
}
pre.shiki span {
  color: var(--shiki-dark) !important;
}

/* ── Prose on paper ──────────────────────────── */
.prose {
  --tw-prose-body: var(--color-ink);
  --tw-prose-headings: var(--color-ink);
  --tw-prose-links: var(--color-red);
  --tw-prose-bold: var(--color-ink);
  --tw-prose-code: var(--color-ink);
  --tw-prose-quotes: var(--color-ink);
  --tw-prose-quote-borders: var(--color-red);
  --tw-prose-counters: var(--color-ink-muted);
  --tw-prose-bullets: var(--color-ink-muted);
  --tw-prose-hr: rgb(43 39 34 / 0.2);
  --tw-prose-th-borders: rgb(43 39 34 / 0.3);
  --tw-prose-td-borders: rgb(43 39 34 / 0.2);
  --tw-prose-captions: var(--color-ink-muted);
}
```

- [ ] **Step 4: Scrie primitivele de rack**

`src/components/rack/unit.tsx`:

```tsx
interface UnitProps {
  id?: string;
  className?: string;
  labelledBy?: string;
  children: React.ReactNode;
}

function Ear({ right = false }: { right?: boolean }) {
  return (
    <div className={right ? "ear ear-right" : "ear"} aria-hidden="true">
      <span className="ear-hole" />
      <span className="ear-hole" />
    </div>
  );
}

export function Unit({ id, className = "", labelledBy, children }: UnitProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`unit ${className}`.trim()}>
      <Ear />
      <div className="unit-face">{children}</div>
      <Ear right />
    </section>
  );
}
```

`src/components/rack/lcd.tsx`:

```tsx
export interface LcdReading {
  label: string;
  value: string;
}

export function Lcd({ items }: { items: LcdReading[] }) {
  return (
    <dl className="lcd">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

`src/components/rack/port.tsx`:

```tsx
import { Link } from "@/i18n/navigation";

export function Socket({ className = "" }: { className?: string }) {
  return <span className={`socket ${className}`.trim()} aria-hidden="true" />;
}

export function PortLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group block min-h-11 text-center">
      <Socket />
      <span className="engraved mt-1.5 block tracking-[0.1em] group-hover:text-ink">{label}</span>
    </Link>
  );
}
```

`src/components/rack/faceplate-strip.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function FaceplateStrip() {
  const t = useTranslations("Nav");

  return (
    <header className="unit unit-1u">
      <div className="ear" aria-hidden="true">
        <span className="ear-hole" />
      </div>
      <div className="unit-face flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <Link href="/" className="engraved inline-flex min-h-11 items-center tracking-[0.3em]">
          DevOps<span className="text-red">Flow</span>
        </Link>

        <nav aria-label={t("main_label")} className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex flex-wrap gap-x-5">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="engraved inline-flex min-h-11 items-center gap-2 hover:text-ink">
                  <span className="led" aria-hidden="true" />
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LanguageSwitcher label={t("language")} />
      </div>
      <div className="ear ear-right" aria-hidden="true">
        <span className="ear-hole" />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Rescrie comutatorul de limbă ca taste**

`src/components/layout/language-switcher.tsx`:

```tsx
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
```

- [ ] **Step 6: Rescrie subsolul**

`src/components/layout/footer.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { CERTIFICATIONS } from "@/lib/site";

const linkClass = "inline-flex min-h-8 items-center text-sm text-desk-muted hover:text-desk-ink";

export function Footer() {
  const t = useTranslations("Footer");
  const tServices = useTranslations("ServicesPage");
  const year = new Date().getFullYear();

  return (
    <footer className="on-desk px-2 pt-8 pb-6 text-desk-ink">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">DevOpsFlow</p>
          <p className="mt-2 text-sm text-desk-muted">{t("description")}</p>
          <p className="mt-1 text-xs text-desk-muted">{t("location")}</p>
        </div>

        <nav aria-label={t("services")}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">{t("services")}</h2>
          <ul className="mt-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkClass}>
                  {tServices(`${service.key}_title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("company")}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">{t("company")}</h2>
          <ul className="mt-2">
            <li>
              <Link href="/about" className={linkClass}>
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className={linkClass}>
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link href="/#contact" className={linkClass}>
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="flex flex-wrap content-start gap-1.5 font-mono text-xs text-desk-muted">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert} className="rounded-[3px] border border-desk-muted/50 px-2 py-0.5">
              {cert}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 border-t border-desk-muted/30 pt-4 text-center text-xs text-desk-muted">
        &copy; {year} DevOpsFlow. {t("rights")}
      </p>
    </footer>
  );
}
```

- [ ] **Step 7: Actualizează layout-ul**

În `src/app/[locale]/layout.tsx`:

Înlocuiește importurile de font și de componente (liniile cu `Inter_Tight, JetBrains_Mono`, `ThemeProvider`, `SideRail`, `TopBar`, `Footer`) cu:

```tsx
import { IBM_Plex_Mono, Jost, Playfair_Display } from "next/font/google";
import { FaceplateStrip } from "@/components/rack/faceplate-strip";
import { Footer } from "@/components/layout/footer";
```

Înlocuiește cele două constante de font (`sans`, `mono`) și comentariul de deasupra lor cu:

```tsx
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
```

Înlocuiește blocul `return ( <html ...> ... </html> );` cu:

```tsx
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
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
```

- [ ] **Step 8: Șterge componentele înlocuite**

```bash
git rm -q src/components/theme-provider.tsx src/components/layout/theme-toggle.tsx \
  src/components/layout/side-rail.tsx src/components/layout/top-bar.tsx src/components/ui/sheet.tsx
grep -rn "theme-provider\|theme-toggle\|side-rail\|top-bar\|ui/sheet\|next-themes" src || echo "no references"
```
Expected: `no references`.

- [ ] **Step 9: Rulează verificările și comite**

Run: `rm -rf .next && npm run type-check && npm run lint && npm test`
Expected: PASS. Secțiunile vechi folosesc încă clase care nu mai există (`btn-primary`, `card-surface`), deci arată nestilizat până la Task 2–5; testele rămân verzi.

```bash
git add -A src
git commit -q -m "feat: add enamel rack material, primitives and faceplate header"
```

---

### Task 2: Home — cele șase module

**Files:**
- Rewrite: `src/components/sections/hero.tsx`, `services.tsx`, `about-teaser.tsx`, `process.tsx`, `contact.tsx`, `src/components/blog/blog-card.tsx`, `src/app/[locale]/page.tsx`, `src/__tests__/home.test.tsx`
- Create: `src/components/sections/blog-tray.tsx`
- Modify: `src/components/contact/contact-form.tsx`, `src/lib/site.ts`, `messages/en.json`, `messages/ro.json`, `messages/ru.json`, `src/__tests__/messages.test.ts`
- Delete: `src/components/sections/code-window.tsx`, `src/components/sections/proof.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/label.tsx`

**Interfaces:**
- Consumes: `Unit`, `Lcd`, `PortLink`, `Socket` (Task 1); `STATS`, `services`, `getAllPosts`, `BlogPost`
- Produces: `<Hero />`, `<Services />`, `<AboutTeaser />`, `<Process />`, `<BlogTray posts={BlogPost[]} />`, `<Contact />`, `<BlogCard post />`; `STATS[i].lcd`; chei noi `Hero.role`, `Hero.title_1`, `Hero.title_2`, `Lcd.{uptime,requests,experience,deploys}`, `Ports.{ci_cd,…,consulting}`, `Home.blog_label`, `Home.blog_title`, `Home.blog_all`

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
import type { BlogPost } from "@/lib/blog";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { BlogTray } from "@/components/sections/blog-tray";
import { Contact } from "@/components/sections/contact";

function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
}

const post: BlogPost = {
  slug: "first-post",
  frontmatter: {
    title: "First Post",
    description: "About the first post",
    date: "2025-01-15",
    tags: ["kubernetes"],
    locale: "en",
    author: "Maxim Cujba",
  },
  readingTime: 4,
};

describe("Hero", () => {
  it("renders one h1 with the accent word emphasized", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    expect(container.querySelector("h1 em")?.textContent).toBe("title_2");
  });

  it("shows the four confirmed numbers on the display as static text", () => {
    const { container } = render(<Hero />);
    const values = Array.from(container.querySelectorAll("dd")).map((n) => n.textContent);
    expect(values).toEqual(["99.9%", "10M+", "10+", "−60%"]);
  });

  it("has one port per service and a contact key", () => {
    const { container } = render(<Hero />);
    const links = hrefs(container);
    expect(links.filter((h) => h.startsWith("/services/")).length).toBe(8);
    expect(links).toContain("/services/ci-cd");
    expect(links[links.length - 1]).toBe("/#contact");
  });
});

describe("Services", () => {
  it("is the #services anchor and links each of the 8 services to its detail page", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("section")?.id).toBe("services");
    const links = hrefs(container);
    expect(links.length).toBe(8);
    expect(links).toContain("/services/consulting");
  });
});

describe("AboutTeaser", () => {
  it("shows the founder's photo with his name as alt text", () => {
    const { container } = render(<AboutTeaser />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("founder_name");
    expect(img?.getAttribute("src")).toContain("maxim-cujba.jpg");
  });

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

describe("BlogTray", () => {
  it("lists the given posts and links to the full blog", () => {
    const { container } = render(<BlogTray posts={[post]} />);
    expect(container.querySelector("section")?.id).toBe("blog");
    const links = hrefs(container);
    expect(links).toContain("/blog/first-post");
    expect(links).toContain("/blog");
  });

  it("renders nothing when the locale has no posts, instead of an empty tray", () => {
    const { container } = render(<BlogTray posts={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("Contact", () => {
  it("exposes the contact anchor, the form and direct contact links", () => {
    const { container, getByTestId } = render(<Contact />);
    expect(container.querySelector("section")?.id).toBe("contact");
    expect(getByTestId("contact-form")).toBeInTheDocument();
    expect(hrefs(container)).toContain("mailto:info@skynet.hosting");
  });

  it("lists the four contact details as a plain list", () => {
    const { container } = render(<Contact />);
    expect(container.querySelectorAll("ul > li").length).toBe(4);
    expect(container.querySelector("dl")).toBeNull();
  });
});
```

În `src/__tests__/messages.test.ts`, înlocuiește lista din testul „contain the redesign keys” cu:

```ts
    for (const key of [
      "Hero.role",
      "Hero.title_1",
      "Hero.title_2",
      "Lcd.uptime",
      "Ports.consulting",
      "Services.consulting_short",
      "Home.about_title",
      "Home.blog_all",
      "NotFound.title",
    ]) {
```

și lista din testul „carry localized accessibility labels and a distinct About title” cu:

```ts
    for (const key of ["Nav.main_label", "Nav.language", "AboutPage.meta_title"]) {
```

- [ ] **Step 2: Rulează testele și confirmă că pică**

Run: `npx vitest run src/__tests__/home.test.tsx src/__tests__/messages.test.ts`
Expected: FAIL, „Failed to resolve import "@/components/sections/blog-tray"” și `Hero.role` lipsă.

- [ ] **Step 3: Adaugă valoarea de afișaj în `src/lib/site.ts`**

Înlocuiește constanta `STATS` cu:

```ts
export const STATS = [
  { key: "uptime", value: "99.9%", lcd: "99.9%" },
  { key: "requests", value: "10M+", lcd: "10M+" },
  { key: "experience", value: "10+", lcd: "10+" },
  { key: "deploys", value: "60%", lcd: "−60%" },
] as const;
```

- [ ] **Step 4: Actualizează traducerile**

În fiecare fișier, înlocuiește integral namespace-ul `Hero`, schimbă `Services.label` și `Process.label`, adaugă cheile `blog_*` în `Home` și adaugă namespace-urile `Lcd` și `Ports`. Restul cheilor rămân.

`messages/en.json`:

```json
"Hero": {
  "role": "Maxim Cujba · Senior DevOps Engineer",
  "title_1": "Infrastructure that stays up, deploys that ship",
  "title_2": "faster.",
  "description": "Kubernetes, CI/CD and cloud engineering for teams that can't afford downtime. In production since 2012.",
  "cta_primary": "Book a free consultation"
},
"Services": { "label": "What I do" },
"Process": { "label": "How I work" },
"Home": {
  "blog_label": "From the blog",
  "blog_title": "Latest articles",
  "blog_all": "All articles"
},
"Lcd": {
  "uptime": "Uptime SLA",
  "requests": "Req / day",
  "experience": "Years",
  "deploys": "Deploy time"
},
"Ports": {
  "ci_cd": "CI/CD",
  "kubernetes": "K8s",
  "cloud": "Cloud",
  "monitoring": "Monitor",
  "security": "Security",
  "networking": "Network",
  "linux": "Linux",
  "consulting": "Consult"
}
```

`messages/ro.json`:

```json
"Hero": {
  "role": "Maxim Cujba · Senior DevOps Engineer",
  "title_1": "Infrastructură care rămâne în picioare, livrări care ajung",
  "title_2": "mai repede.",
  "description": "Inginerie Kubernetes, CI/CD și cloud pentru echipe care nu-și permit downtime. În producție din 2012.",
  "cta_primary": "Programează o consultație gratuită"
},
"Services": { "label": "Ce fac" },
"Process": { "label": "Cum lucrez" },
"Home": {
  "blog_label": "Din blog",
  "blog_title": "Ultimele articole",
  "blog_all": "Toate articolele"
},
"Lcd": {
  "uptime": "SLA uptime",
  "requests": "Cereri / zi",
  "experience": "Ani",
  "deploys": "Timp deploy"
},
"Ports": {
  "ci_cd": "CI/CD",
  "kubernetes": "K8s",
  "cloud": "Cloud",
  "monitoring": "Monitor",
  "security": "Securitate",
  "networking": "Rețele",
  "linux": "Linux",
  "consulting": "Consult"
}
```

`messages/ru.json`:

```json
"Hero": {
  "role": "Максим Кужба · Senior DevOps Engineer",
  "title_1": "Инфраструктура, которая не падает, и релизы, которые выходят",
  "title_2": "быстрее.",
  "description": "Kubernetes, CI/CD и облачная инженерия для команд, которые не могут позволить себе простой. В продакшене с 2012 года.",
  "cta_primary": "Записаться на бесплатную консультацию"
},
"Services": { "label": "Чем я занимаюсь" },
"Process": { "label": "Как я работаю" },
"Home": {
  "blog_label": "Из блога",
  "blog_title": "Последние статьи",
  "blog_all": "Все статьи"
},
"Lcd": {
  "uptime": "SLA аптайм",
  "requests": "Запросов / день",
  "experience": "Лет",
  "deploys": "Время деплоя"
},
"Ports": {
  "ci_cd": "CI/CD",
  "kubernetes": "K8s",
  "cloud": "Облако",
  "monitoring": "Монитор",
  "security": "Защита",
  "networking": "Сети",
  "linux": "Linux",
  "consulting": "Консалт"
}
```

`Hero` pierde cheile `pill` și `cta_secondary`. `Home.proof_title` se șterge din toate cele trei fișiere.

- [ ] **Step 5: Rescrie `src/components/sections/hero.tsx`**

```tsx
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
```

- [ ] **Step 6: Rescrie `src/components/sections/services.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { Socket } from "@/components/rack/port";
import { services } from "@/lib/services";

export function Services() {
  const t = useTranslations("Services");
  const tPage = useTranslations("ServicesPage");

  return (
    <Unit id="services" labelledBy="services-title">
      <p className="label-red">{t("label")}</p>
      <h2 id="services-title" className="display mt-1 text-2xl sm:text-3xl">
        {t("title")}
      </h2>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="raised grid h-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 p-3"
            >
              <Socket className="mt-0.5" />
              <span>
                <span className="display block text-base">{tPage(`${service.key}_title`)}</span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                  {t(`${service.key}_short`)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Unit>
  );
}
```

- [ ] **Step 7: Rescrie `src/components/sections/about-teaser.tsx`**

```tsx
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

const HIGHLIGHTS = ["duocircle", "ebs", "orange", "moldtelecom"] as const;

export function AboutTeaser() {
  const t = useTranslations("Home");
  const tAbout = useTranslations("AboutPage");

  return (
    <Unit id="about" labelledBy="about-title">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr_1fr] lg:gap-8">
        <div className="sheet w-fit p-2 pb-3">
          <Image
            src="/maxim-cujba.jpg"
            alt={tAbout("founder_name")}
            width={160}
            height={160}
            className="h-40 w-40 object-cover"
          />
          <p className="mt-2 text-center font-mono text-[0.6875rem] text-ink-muted">
            {tAbout("founder_role")}
          </p>
        </div>

        <div>
          <p className="label-red">{t("about_label")}</p>
          <h2 id="about-title" className="display mt-1 text-2xl sm:text-3xl">
            {t("about_title")}
          </h2>
          <p className="relief mt-3 leading-relaxed text-ink-muted">{t("about_p")}</p>
          <Link
            href="/about"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4"
          >
            {t("about_link")} →
          </Link>
        </div>

        <ul className="ledger content-start text-sm">
          {HIGHLIGHTS.map((key) => (
            <li key={key} className="flex items-baseline justify-between gap-4 py-2.5">
              <span>
                <span className="font-semibold">{tAbout(`tl_${key}_company`)}</span>
                <span className="block text-ink-muted">{tAbout(`tl_${key}_role`)}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-ink-muted">
                {tAbout(`tl_${key}_date`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Unit>
  );
}
```

- [ ] **Step 8: Rescrie `src/components/sections/process.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Unit } from "@/components/rack/unit";

const STEPS = ["discovery", "architecture", "implementation", "support"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <Unit id="process" labelledBy="process-title">
      <p className="label-red">{t("label")}</p>
      <h2 id="process-title" className="display mt-1 text-2xl sm:text-3xl">
        {t("title")}
      </h2>
      <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span className="stamp" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3 className="display text-lg">{t(`${step}_title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`${step}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}
```

- [ ] **Step 9: Rescrie `src/components/blog/blog-card.tsx` ca fișă**

```tsx
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const { slug, frontmatter, readingTime } = post;
  // Frontmatter dates are date-only, so format in UTC to avoid an off-by-one day.
  const date = new Date(frontmatter.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link href={`/blog/${slug}`} className="sheet block h-full border-t-[3px] border-t-red p-4">
      <p className="font-mono text-[0.6875rem] text-ink-muted">
        <time dateTime={frontmatter.date}>{date}</time> · {readingTime} {t("min_read")}
      </p>
      <h2 className="mt-2 font-display text-lg font-bold leading-snug">{frontmatter.title}</h2>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
        {frontmatter.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {frontmatter.tags.map((tag) => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
```

- [ ] **Step 10: Scrie `src/components/sections/blog-tray.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/blog";

export function BlogTray({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("Home");

  if (posts.length === 0) return null;

  return (
    <Unit id="blog" labelledBy="blog-title">
      <div className="flex flex-wrap items-end justify-between gap-x-6">
        <div>
          <p className="label-red">{t("blog_label")}</p>
          <p id="blog-title" role="heading" aria-level={2} className="display mt-1 text-2xl sm:text-3xl">
            {t("blog_title")}
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-red underline underline-offset-4"
        >
          {t("blog_all")} →
        </Link>
      </div>
      <ul className="inset mt-4 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </Unit>
  );
}
```

Titlul modulului e un paragraf cu `role="heading"` de nivel 2, pentru că fișele folosesc deja `h2` (necesar pe pagina `/blog`, unde stau direct sub `h1`).

- [ ] **Step 11: Rescrie `src/components/sections/contact.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Unit } from "@/components/rack/unit";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/site";

const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-red";

export function Contact() {
  const t = useTranslations("ContactPage");

  return (
    <Unit id="contact" labelledBy="contact-title">
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="label-red">{t("label")}</p>
          <h2 id="contact-title" className="display mt-1 text-2xl sm:text-3xl">
            {t("title")}
          </h2>
          <p className="relief mt-3 leading-relaxed text-ink-muted">{t("description")}</p>

          <ul className="ledger mt-5 text-sm">
            <li className="flex gap-3 py-2.5">
              <Mail className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_email_label")}</p>
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-8 items-center text-ink-muted underline underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <Phone className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_phone_label")}</p>
                <p>
                  <a href={`tel:${CONTACT_PHONE}`} className="inline-flex min-h-8 items-center text-ink-muted underline underline-offset-4">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <MapPin className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_location_label")}</p>
                <p className="text-ink-muted">{t("info_location_value")}</p>
              </div>
            </li>
            <li className="flex gap-3 py-2.5">
              <Clock className={iconClass} aria-hidden="true" />
              <div>
                <p className="font-semibold">{t("info_hours_label")}</p>
                <p className="text-ink-muted">{t("info_hours_value")}</p>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </Unit>
  );
}
```

- [ ] **Step 12: Restilizează `src/components/contact/contact-form.tsx`**

Logica (hook-uri, efectul Turnstile, `Script`, `formKey`, numele câmpurilor) nu se atinge. Schimbări, exact:

1. Șterge importurile `Input`, `Textarea`, `Label` și scoate `Send` din importul `lucide-react` (rămân `CheckCircle, AlertCircle, Loader2`).
2. Containerul exterior: `<div className="card-surface p-6 sm:p-8">` devine `<div className="sheet p-5 sm:p-6">`.
3. Blocul cu iconița `Send` și `<h2>` devine:

```tsx
      <h3 className="display mb-4 text-lg">{tCta("form_title")}</h3>
```

4. Bannerul de succes devine:

```tsx
        <div className="mb-4 flex items-start gap-3 border border-ink/30 bg-enamel p-3" role="status">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm">{t("success")}</p>
        </div>
```

5. Bannerul de eroare devine:

```tsx
        <div className="mb-4 flex items-start gap-3 border border-red bg-enamel p-3" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red" aria-hidden="true" />
          <p className="text-sm text-red">{t(state.message as Parameters<typeof t>[0])}</p>
        </div>
```

6. Fiecare `<Label htmlFor="X" className="...">` devine `<label htmlFor="X" className="engraved mb-1.5 block">`, cu `</Label>` → `</label>`.
7. `<Input` devine `<input className="field"`; `<Textarea` devine `<textarea className="field"`. Atributele existente (`id`, `name`, `type`, `required`, `minLength`, `maxLength`, `rows`, `disabled`) rămân.
8. Toate aparițiile `text-xs text-destructive` devin `text-xs text-red`.
9. Butonul de trimitere: `className="btn-primary w-full disabled:opacity-60"` devine `className="key-red w-full"`; șterge iconița `<Send ... />` de după `{tCta("form_submit")}` și clasa `mr-2` de pe `Loader2`.

Verificare:

```bash
grep -n "ui/\|Send\|card-surface\|btn-primary\|destructive\|green-\|dark:" src/components/contact/contact-form.tsx || echo "clean"
git diff --stat src/__tests__/contact-form.test.tsx
```
Expected: `clean`; testul de captcha nu e modificat.

```bash
git rm -q src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/ui/label.tsx
```

- [ ] **Step 13: Rescrie `src/app/[locale]/page.tsx`**

Păstrează `generateMetadata` exact cum e. Înlocuiește importurile de secțiuni și corpul `HomePage`:

```tsx
import { getAllPosts } from "@/lib/blog";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { BlogTray } from "@/components/sections/blog-tray";
import { Contact } from "@/components/sections/contact";
```

```tsx
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const posts = getAllPosts(locale as Locale).slice(0, 3);

  return (
    <>
      <JsonLd data={personJsonLd(locale as Locale)} />
      <JsonLd data={professionalServiceJsonLd(locale as Locale, t("description"))} />
      <Hero />
      <Services />
      <AboutTeaser />
      <Process />
      <BlogTray posts={posts} />
      <Contact />
    </>
  );
}
```

Șterge importurile `CodeWindow` și `Proof`, apoi:

```bash
git rm -q src/components/sections/code-window.tsx src/components/sections/proof.tsx
grep -rn "code-window\|sections/proof\|proof_title\|Hero\.pill\|cta_secondary" src messages || echo "no references"
```
Expected: `no references`.

- [ ] **Step 14: Rulează verificările și comite**

Run: `rm -rf .next && npm run type-check && npm run lint && npm test`
Expected: PASS, inclusiv cele 3 teste de captcha neschimbate.

```bash
git add -A src messages
git commit -q -m "feat: rebuild home as six rack modules with blog tray"
```

---

### Task 3: Paginile de serviciu

**Files:**
- Rewrite: `src/components/services/service-detail-hero.tsx`, `service-features.tsx`, `service-tools.tsx`, `related-services.tsx`, `src/components/sections/cta-band.tsx`
- Modify: `src/app/[locale]/services/[slug]/page.tsx`
- Test: `src/__tests__/services.test.tsx` (existent; trebuie să treacă fără modificări)

**Interfaces:**
- Consumes: `Unit`, `Socket` (Task 1)
- Produces: aceleași componente și props ca până acum; fiecare întoarce un bloc fără ramă proprie, iar pagina le așază în module

- [ ] **Step 1: Confirmă că testele existente descriu comportamentul dorit**

Run: `npx vitest run src/__tests__/services.test.tsx`
Expected: PASS (7 teste). Ele rămân plasa de siguranță: un `h1`, link înapoi la `/#services`, 4 funcții, unelte separate, 3 servicii înrudite, CTA spre `/#contact`.

- [ ] **Step 2: Rescrie componentele**

`service-detail-hero.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Socket } from "@/components/rack/port";
import { getServiceBySlug } from "@/lib/services";

export function ServiceDetailHero({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <div>
      <Link href="/#services" className="engraved inline-flex min-h-11 items-center hover:text-ink">
        ← {t("back_to_services")}
      </Link>
      <div className="mt-3 grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
        <Socket className="mt-2 h-10" />
        <div>
          <h1 className="display text-3xl leading-tight sm:text-4xl">{t(`${service.key}_title`)}</h1>
          <p className="relief mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {t(`${service.key}_desc`)}
          </p>
        </div>
      </div>
    </div>
  );
}
```

`service-features.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { getServiceBySlug } from "@/lib/services";

const FEATURES = ["f1", "f2", "f3", "f4"] as const;

export function ServiceFeatures({ slug }: { slug: string }) {
  const t = useTranslations("ServicesPage");
  const service = getServiceBySlug(slug)!;

  return (
    <div className="mt-8">
      <h2 className="label-red">{t("features_label")}</h2>
      <ul className="ledger mt-2 grid gap-x-8 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex gap-3 py-2.5 text-sm">
            <span className="led led-on mt-1.5" aria-hidden="true" />
            {t(`${service.key}_${feature}`)}
          </li>
        ))}
      </ul>
    </div>
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
    <div className="mt-8">
      <h2 className="label-red">{t("tools_label")}</h2>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {tools.map((tool) => (
          <li key={tool} className="tag">
            {tool}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`related-services.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Socket } from "@/components/rack/port";
import { getRelatedServices } from "@/lib/services";

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("ServicesPage");
  const related = getRelatedServices(currentSlug);

  return (
    <div>
      <h2 className="label-red">{t("related_services")}</h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {related.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="raised grid h-full grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3"
            >
              <Socket />
              <span className="display text-base">{t(`${service.key}_title`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/components/sections/cta-band.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaBand() {
  const t = useTranslations("ServicesPage");

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/20 pt-6">
      <div>
        <h2 className="display text-xl">{t("cta_title")}</h2>
        <p className="mt-1 max-w-xl text-sm text-ink-muted">{t("cta_description")}</p>
      </div>
      <Link href="/#contact" className="key-red">
        {t("cta_button")}
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Așază-le în module, în pagină**

În `src/app/[locale]/services/[slug]/page.tsx`, adaugă `import { Unit } from "@/components/rack/unit";` și înlocuiește cele cinci componente de la finalul JSX-ului cu:

```tsx
      <Unit>
        <ServiceDetailHero slug={slug} />
        <ServiceFeatures slug={slug} />
        <ServiceTools slug={slug} />
      </Unit>
      <Unit>
        <RelatedServices currentSlug={slug} />
        <CtaBand />
      </Unit>
```

- [ ] **Step 4: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS; `services.test.tsx` neschimbat.

```bash
git add -A src
git commit -q -m "feat: restyle service pages as rack modules"
```

---

### Task 4: Pagina About

**Files:**
- Rewrite: `src/components/about/about-sections.tsx`
- Test: `src/__tests__/about.test.tsx` (existent; trebuie să treacă fără modificări)

**Interfaces:**
- Consumes: `Unit` (Task 1)
- Produces: aceleași opt exporturi (`AboutHero`, `AboutCompany`, `AboutFounder`, `AboutTimeline`, `AboutCertifications`, `AboutProcess`, `AboutValues`, `AboutCTA`); `src/app/[locale]/about/page.tsx` nu se schimbă

- [ ] **Step 1: Confirmă plasa de siguranță**

Run: `npx vitest run src/__tests__/about.test.tsx`
Expected: PASS (4 teste: `h1`, cronologie fără STM, `h2` pentru cronologie, CTA spre `/#contact`).

- [ ] **Step 2: Rescrie `src/components/about/about-sections.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

/* ─── Hero ────────────────────────────────────────────── */

export function AboutHero() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <p className="engraved">{t("founder_name")}</p>
      <h1 className="display mt-2 max-w-3xl text-3xl leading-tight sm:text-5xl">{t("hero_title")}</h1>
      <p className="relief mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{t("hero_subtitle")}</p>
    </Unit>
  );
}

/* ─── Founder ─────────────────────────────────────────── */

export function AboutFounder() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <div>
          <h2 className="display text-2xl">{t("founder_name")}</h2>
          <p className="engraved mt-1">{t("founder_role")}</p>
        </div>
        <div className="sheet space-y-4 p-5 leading-relaxed sm:p-6">
          <p>{t("founder_p1")}</p>
          <p>{t("founder_p2")}</p>
          <p>{t("founder_p3")}</p>
          <p className="border-l-2 border-red pl-4 font-display text-lg italic">{t("founder_approach")}</p>
        </div>
      </div>
    </Unit>
  );
}

/* ─── Certifications ──────────────────────────────────── */

const certKeys = ["cka", "ccnp", "lpic", "nse", "juniper", "mikrotik"] as const;

export function AboutCertifications() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("certs_title")}</h2>
      <p className="relief mt-2 max-w-2xl text-ink-muted">{t("certs_subtitle")}</p>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {certKeys.map((key) => (
          <li key={key} className="raised p-4">
            <h3 className="display text-base leading-snug">{t(`cert_${key}_name`)}</h3>
            <p className="mt-1 font-mono text-[0.6875rem] text-ink-muted">{t(`cert_${key}_org`)}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(`cert_${key}_desc`)}</p>
          </li>
        ))}
      </ul>
    </Unit>
  );
}

/* ─── Process ─────────────────────────────────────────── */

const processSteps = ["s1", "s2", "s3", "s4"] as const;

export function AboutProcess() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("process_title")}</h2>
      <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {processSteps.map((step, index) => (
          <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span className="stamp" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3 className="display text-lg">{t(`process_${step}_title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`process_${step}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}

/* ─── Timeline ────────────────────────────────────────── */

const timelineEntries = [
  "moldtelecom", "orange", "saltedge",
  "gilat", "alexhost", "ebs", "duocircle", "skynet",
] as const;

export function AboutTimeline() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="label-red">{t("timeline_label")}</h2>
      <ol className="ledger mt-2">
        {timelineEntries.map((key) => (
          <li key={key} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <p className="font-mono text-xs text-ink-muted sm:pt-1">{t(`tl_${key}_date`)}</p>
            <div>
              <h3 className="display text-lg leading-snug">{t(`tl_${key}_company`)}</h3>
              <p className="text-sm font-medium">{t(`tl_${key}_role`)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(`tl_${key}_desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Unit>
  );
}

/* ─── Company ─────────────────────────────────────────── */

export function AboutCompany() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <h2 className="display text-2xl">{t("company_name")}</h2>
        <div className="sheet space-y-4 p-5 leading-relaxed sm:p-6">
          <p>{t("company_p1")}</p>
          <p>{t("company_p2")}</p>
          <p className="font-semibold text-red">{t("company_registered")}</p>
        </div>
      </div>
    </Unit>
  );
}

/* ─── Values ──────────────────────────────────────────── */

const values = ["1", "2", "3", "4"] as const;

export function AboutValues() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <h2 className="display text-2xl sm:text-3xl">{t("values_title")}</h2>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {values.map((key) => (
          <li key={key} className="raised p-4">
            <h3 className="display text-lg leading-snug">{t(`value_${key}_title`)}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t(`value_${key}_desc`)}</p>
          </li>
        ))}
      </ul>
    </Unit>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */

export function AboutCTA() {
  const t = useTranslations("AboutPage");

  return (
    <Unit>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="display text-2xl">{t("cta_title")}</h2>
          <p className="mt-1 max-w-xl text-ink-muted">{t("cta_desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/#contact" className="key-red">
            {t("cta_consult")}
          </Link>
          <Link href="/#services" className="key min-h-11 px-4 font-sans tracking-[0.12em]">
            {t("cta_services")}
          </Link>
        </div>
      </div>
    </Unit>
  );
}
```

- [ ] **Step 3: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS; `about.test.tsx` neschimbat.

```bash
git add -A src
git commit -q -m "feat: restyle about page as rack modules"
```

---

### Task 5: Blog, 404, imagine Open Graph

**Files:**
- Rewrite: `src/components/blog/blog-listing-section.tsx`, `src/lib/mdx-components.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/opengraph-image.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`
- Test: `src/__tests__/blog.test.tsx`, `src/__tests__/not-found.test.tsx` (existente; trebuie să treacă fără modificări)

**Interfaces:**
- Consumes: `Unit`, `Lcd` (Task 1), `BlogCard` (Task 2)
- Produces: aceleași exporturi și props ca până acum

- [ ] **Step 1: Confirmă plasa de siguranță**

Run: `npx vitest run src/__tests__/blog.test.tsx src/__tests__/not-found.test.tsx`
Expected: PASS (fișa are `h2`, dată localizată, etichete, link; lista are stare goală; 404 are `h1` și link spre `/`).

- [ ] **Step 2: Lista de articole**

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
    return <p className="relief text-lg text-ink-muted">{t("no_posts")}</p>;
  }

  return (
    <ul className="inset grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
```

În `src/app/[locale]/blog/page.tsx`, adaugă `import { Unit } from "@/components/rack/unit";` și înlocuiește JSX-ul întors de `BlogPage` cu:

```tsx
    <Unit>
      <p className="label-red">{t("label")}</p>
      <h1 className="display mt-1 text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="relief mt-3 max-w-2xl text-lg text-ink-muted">{t("subtitle")}</p>
      <div className="mt-6">
        <BlogListingSection posts={posts} />
      </div>
    </Unit>
```

- [ ] **Step 3: Pagina de articol**

În `src/app/[locale]/blog/[slug]/page.tsx`: adaugă `import { Unit } from "@/components/rack/unit";`, șterge importul `lucide-react` și înlocuiește JSX-ul întors de `BlogPostPage` cu:

```tsx
    <>
      <JsonLd
        data={blogPostingJsonLd({
          locale: locale as Locale,
          slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          date: post.frontmatter.date,
        })}
      />
      <Unit>
        <Link href="/blog" className="engraved inline-flex min-h-11 items-center hover:text-ink">
          ← {t("back_to_blog")}
        </Link>
        <h1 className="display mt-2 max-w-3xl text-3xl leading-tight sm:text-4xl">
          {post.frontmatter.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-ink-muted">
          {t("published")}{" "}
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>{" "}
          · {post.readingTime} {t("min_read")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("tags_label")}>
          {post.frontmatter.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </Unit>

      <article className="sheet prose prose-lg mx-auto w-full max-w-[72ch] px-5 py-8 sm:px-10">
        <p className="lead">{post.frontmatter.description}</p>
        {post.content}
      </article>
    </>
```

- [ ] **Step 4: Componentele MDX pe hârtie**

`src/lib/mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => <h2 className="display mt-10 mb-4 text-3xl first:mt-0" {...props} />,
  h2: (props) => <h2 className="display mt-8 mb-3 text-2xl" {...props} />,
  h3: (props) => <h3 className="display mt-6 mb-2 text-xl" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-red underline underline-offset-4"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-[3px] border border-ink/40 p-4 text-sm leading-relaxed" {...props} />
  ),
  code: (props) => {
    const isInline = typeof props.children === "string";
    if (!isInline) return <code {...props} />;
    return <code className="rounded-[3px] border border-ink/20 bg-enamel px-1.5 py-0.5 font-mono text-sm" {...props} />;
  },
  blockquote: (props) => (
    <blockquote className="my-6 border-l-2 border-red pl-4 font-display italic" {...props} />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border border-ink/30 px-4 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="border border-ink/20 px-4 py-2" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />,
  li: (props) => <li {...props} />,
  hr: () => <hr className="my-8 border-ink/20" />,
  p: (props) => <p className="my-4 leading-relaxed" {...props} />,
};
```

Titlul `#` dintr-un articol devine `h2`, fiindcă `h1` e titlul paginii.

- [ ] **Step 5: 404**

`src/app/[locale]/not-found.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Unit } from "@/components/rack/unit";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Unit>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
        <p className="lcd block text-center font-mono text-5xl" aria-hidden="true">
          404
        </p>
        <div>
          <h1 className="display text-3xl sm:text-4xl">{t("title")}</h1>
          <p className="relief mt-3 text-ink-muted">{t("description")}</p>
          <Link href="/" className="key-red mt-5">
            {t("cta")}
          </Link>
        </div>
      </div>
    </Unit>
  );
}
```

- [ ] **Step 6: Imaginea Open Graph**

În `src/app/[locale]/opengraph-image.tsx`, înlocuiește JSX-ul din `new ImageResponse(( ... ), size)` cu:

```tsx
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 36,
          background: "#23282b",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            borderRadius: 10,
            border: "2px solid #b3aa96",
            background: "#ece5d5",
            color: "#2b2722",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#5f574b" }}>
            DEVOPS<span style={{ color: "#a8321a" }}>FLOW</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
              Infrastructure that stays up, deploys that ship faster.
            </div>
            <div style={{ marginTop: 26, fontSize: 30, color: "#5f574b" }}>
              Maxim Cujba · Senior DevOps Engineer
            </div>
          </div>
          <div style={{ display: "flex", height: 8, width: 120, background: "#a8321a" }} />
        </div>
      </div>
```

Comentariul despre textul doar în latină și exporturile `alt`, `size`, `contentType` rămân.

- [ ] **Step 7: Rulează verificările și comite**

Run: `npm run type-check && npm run lint && npm test`
Expected: PASS; `blog.test.tsx` și `not-found.test.tsx` neschimbate.

```bash
git add -A src
git commit -q -m "feat: restyle blog, 404 and share image"
```

---

### Task 6: Curățenie, reguli de design, documentație

**Files:**
- Create: `src/__tests__/design-rules.test.ts`, `docs/blog-authoring.md`
- Modify: `package.json`, `package-lock.json`, `messages/{en,ro,ru}.json`, `src/__tests__/messages.test.ts`, `CLAUDE.md`
- Delete: `src/components/ui/button.tsx`, `src/lib/utils.ts`, `components.json`

**Interfaces:**
- Consumes: toate task-urile anterioare
- Produces: niciun rest din vechiul design; ghid de adăugare a articolelor

- [ ] **Step 1: Scrie testul regulilor de design**

`src/__tests__/design-rules.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
    return /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

const files = sourceFiles("src").map((path) => ({ path, text: readFileSync(path, "utf8") }));

function offenders(pattern: RegExp): string[] {
  return files.filter(({ text }) => pattern.test(text)).map(({ path }) => path);
}

describe("design rules", () => {
  it("keeps the old gradient look out of the codebase", () => {
    expect(offenders(/text-gradient|bg-gradient-solid|backdrop-blur/)).toEqual([]);
  });

  it("has a single theme and no theme library", () => {
    expect(offenders(/next-themes|dark:/)).toEqual([]);
  });

  it("does not use the generic default typeface", () => {
    expect(offenders(/Inter_Tight|\bInter\b/)).toEqual([]);
  });

  it("has no pill-shaped controls", () => {
    expect(offenders(/rounded-full/)).toEqual([]);
  });

  it("limits client components to the language keys and the contact form", () => {
    expect(offenders(/^"use client"/m).sort()).toEqual([
      "src/components/contact/contact-form.tsx",
      "src/components/layout/language-switcher.tsx",
    ]);
  });

  it("uses exactly one accent colour token", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const tokens = [...css.matchAll(/--color-([a-z-]+):/g)].map((m) => m[1]);
    expect(tokens).toEqual([
      "desk", "desk-ink", "desk-muted", "enamel", "paper", "well",
      "ink", "ink-muted", "red", "lcd", "lcd-ink", "socket", "edge",
    ]);
  });
});
```

În `src/__tests__/messages.test.ts`, înlocuiește lista din testul „drop keys that nothing renders…” cu:

```ts
    for (const key of [
      "Stats.deploys_desc",
      "Header.cta",
      "Nav.home",
      "Nav.menu",
      "Nav.theme",
      "Nav.close",
      "Nav.mobile_label",
      "Stats.uptime_label",
      "Hero.pill",
      "Home.proof_title",
    ]) {
```

- [ ] **Step 2: Rulează testele și confirmă că pică**

Run: `npx vitest run src/__tests__/design-rules.test.ts src/__tests__/messages.test.ts`
Expected: FAIL la „limits client components” sau „has a single theme” (din cauza `src/components/ui/button.tsx`, care conține `dark:`) și la `Nav.menu`.

- [ ] **Step 3: Șterge rămășițele shadcn și dependențele nefolosite**

```bash
git rm -q src/components/ui/button.tsx src/lib/utils.ts components.json
grep -rn "components/ui\|lib/utils\|radix-ui\|class-variance-authority\|tailwind-merge\|\bclsx\b\|tw-animate\|shadcn" src || echo "no references"
npm uninstall next-themes radix-ui class-variance-authority clsx tailwind-merge shadcn tw-animate-css
```
Expected: `no references`, apoi dezinstalare reușită. Dacă `grep` găsește o referință, rezolv-o înainte de dezinstalare.

- [ ] **Step 4: Șterge cheile de traducere nefolosite**

Din toate cele trei fișiere `messages/*.json`:
- `Nav`: `menu`, `mobile_label`, `theme`, `close`
- `Stats`: întregul namespace (etichetele sunt acum în `Lcd`)

```bash
grep -rn 'useTranslations("Stats")\|"Stats"' src || echo "Stats unused"
```
Expected: `Stats unused`.

- [ ] **Step 5: Scrie `docs/blog-authoring.md`**

````markdown
# Cum adaugi un articol pe blog

Un articol este un fișier `.mdx` în `src/content/blog/`. Nu există panou de administrare: adaugi fișierul, faci commit și deploy.

## 1. Numele fișierului

`{slug}.{limbă}.mdx`, de exemplu:

```
src/content/blog/terraform-state-locking.en.mdx
src/content/blog/terraform-state-locking.ro.mdx
src/content/blog/terraform-state-locking.ru.mdx
```

- `slug` devine adresa: `/blog/terraform-state-locking`. Folosește litere mici, cifre și cratime.
- Folosește același `slug` pentru toate limbile aceluiași articol; așa se leagă între ele versiunile (hreflang).
- Poți publica doar într-o limbă. Articolul apare numai în acea limbă, iar sitemap-ul și hreflang-ul țin cont de asta automat.

## 2. Antetul fișierului

```mdx
---
title: "Terraform State Locking, Explained"
description: "O frază care apare în listă, în Google și la distribuire. 120–160 de caractere."
date: "2026-10-20"
tags: ["terraform", "aws"]
locale: "en"
author: "Maxim Cujba"
---

Textul articolului începe aici.
```

- `date` în format `AAAA-LL-ZZ`. Articolele se ordonează după dată, cele mai noi primele.
- `locale` trebuie să fie aceeași limbă ca în numele fișierului.
- `tags`: 1–4 etichete scurte.

## 3. Conținutul

Markdown obișnuit. Titlul articolului vine din antet, deci în text începe cu `##`. Blocurile de cod se evidențiază automat:

````md
```bash
terraform init -backend-config=prod.hcl
```
````

## 4. Verifică local

```bash
npm run dev
```

Deschide `http://localhost:3000/blog` (sau `/ro/blog`, `/ru/blog`) și articolul. Apoi rulează `npm test`: testele de sitemap verifică și articolele.

## 5. Unde apare

- pe `/blog`, în limba lui;
- pe prima pagină, în modulul „Ultimele articole” (cele mai noi trei);
- în `sitemap.xml`, cu data din antet.

## Pentru trafic

- Scrie titlul ca pe o căutare reală („How to…”, „X vs Y”, un mesaj de eroare exact).
- Leagă articolul de pagina de serviciu potrivită, de exemplu `[Kubernetes](/services/kubernetes)`.
- Un articol bun în engleză, tradus apoi în română și rusă, aduce mai mult decât trei articole scurte.
````

- [ ] **Step 6: Actualizează `CLAUDE.md`**

- „Tech Stack”: înlocuiește linia `- Tailwind CSS 4 + shadcn/ui` cu `- Tailwind CSS 4, fără bibliotecă de componente; materialul e definit în src/app/globals.css`.
- „Structura Proiectului”, sub `components/`: înlocuiește liniile `layout/`, `sections/` și `about/, blog/, contact/, ui/` plus `theme-provider.tsx` cu:

```
│   ├── rack/          # unit, faceplate-strip, lcd, port — primitivele de rack
│   ├── layout/        # footer, language-switcher
│   ├── sections/      # hero, services, about-teaser, process, blog-tray, contact, cta-band
│   ├── services/      # service-detail-hero, service-features, service-tools, related-services
│   ├── about/, blog/, contact/
│   └── json-ld.tsx
```

- În același arbore, șterge `utils.ts` din linia `lib/`.
- „Convenții → Cod”: înlocuiește linia `- shadcn/ui pentru componente UI de bază` cu `- Fiecare secțiune de pagină stă într-un <Unit>; suprafețele și controalele folosesc clasele din globals.css (raised, inset, sheet, key, key-red, lcd, socket)`, iar linia despre `"use client"` cu `- Server Components implicit; "use client" doar pentru comutatorul de limbă și formularul de contact`.
- Adaugă o secțiune nouă înainte de „### Git”:

```markdown
### Design
- Skeuomorfic: un rack din email crem pe fundal închis. Spec: docs/superpowers/specs/2026-10-09-skeuomorphic-redesign-design.md
- O singură temă, un singur accent (roșu). Fără text în gradient, fără blur, fără butoane-pastilă, fără Inter — vezi src/__tests__/design-rules.test.ts
- Fonturi: Playfair Display (titluri), Jost (text), IBM Plex Mono (afișaj, taste)
- Articole noi: docs/blog-authoring.md
```

- [ ] **Step 7: Rulează verificările și comite**

Run: `rm -rf .next && npm run type-check && npm run lint && npm test`
Expected: PASS, inclusiv `design-rules.test.ts`.

```bash
git add -A
git commit -q -m "chore: drop unused UI kit and theme library; add design rules and blog guide"
```

---

### Task 7: Verificare pe build-ul de producție

Niciun fișier modificat, în afara corecturilor cerute de rezultate.

- [ ] **Step 1: Build cu cheia de test Turnstile și pornire**

```bash
rm -rf .next
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build
(npx next start -p 3100 >/dev/null 2>&1 &) ; sleep 5
```
Expected: build fără erori, fără avertismente și fără `MISSING_MESSAGE`.

- [ ] **Step 2: Conținut, SEO și rute, fără JavaScript**

```bash
for l in "" /ro /ru; do
  H=$(curl -s "http://localhost:3100$l")
  printf '%s: h1=%s lcd=%s ports=%s canonical=%s hreflang=%s\n' "${l:-/en}" \
    "$(echo "$H" | grep -o '<h1' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o '<dd' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o 'class="socket' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o 'rel="canonical"' | wc -l | tr -d ' ')" \
    "$(echo "$H" | grep -o 'hrefLang=' | wc -l | tr -d ' ')"
done
for p in /about /services/kubernetes /blog /blog/getting-started-with-kubernetes /sitemap.xml /robots.txt /en/opengraph-image; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100$p)" "$p"
done
for p in /services /ro/contact; do printf '%s -> ' "$p"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "http://localhost:3100$p"; done
curl -s -o /dev/null -w 'ro unknown -> %{http_code}\n' http://localhost:3100/ro/nu-exista
curl -s http://localhost:3100/sitemap.xml | grep -c "<loc>"
```
Expected: pe fiecare limbă `h1=1 lcd=4 canonical=1 hreflang=4` și `ports` cel puțin 16 (8 în panou, 8 în servicii); toate rutele 200; redirecturile 308 cu fragment; 404 pentru adresa inexistentă; 39 de adrese în sitemap.

- [ ] **Step 3: Verificări în browser (telefon, contrast forțat, captcha)**

Salvează scriptul de mai jos ca `/tmp/rack-check.mjs` și rulează-l cu `node /tmp/rack-check.mjs`.

```js
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = 9300 + Math.floor(Math.random() * 400);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "rack-"))}`,
  "--no-first-run", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = false;
const check = (name, ok, detail = "") => { if (!ok) failed = true; console.log(`${ok ? "ok  " : "FAIL"} ${name} ${detail}`); };

try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? m.error); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;
  const go = async (path, wait = 2500) => { await send("Page.navigate", { url: `http://localhost:3100${path}` }); await sleep(wait); };
  const shot = async (file) => writeFileSync(file, Buffer.from((await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true })).data, "base64"));
  await send("Page.enable"); await send("Runtime.enable");

  // 1. No horizontal scroll at 360px, in every locale and on inner pages.
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 2, mobile: true });
  for (const path of ["/", "/ro", "/ru", "/ru/about", "/ro/services/monitoring", "/ru/blog/getting-started-with-kubernetes"]) {
    await go(path);
    const over = await ev("document.documentElement.scrollWidth - window.innerWidth");
    check(`no horizontal scroll at 360px ${path}`, over <= 0, `(overflow ${over}px)`);
  }
  await go("/ru"); await shot("/tmp/rack-mobile-ru.png");

  // 2. Forced colours: controls keep a real border.
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "active" }] });
  await go("/");
  for (const sel of [".key", ".key-red", ".field", "a.raised"]) {
    const border = await ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return "missing"; const s = getComputedStyle(e); return s.borderTopStyle + " " + s.borderTopWidth; })()`);
    check(`forced-colors border on ${sel}`, /^solid [1-9]/.test(border), `(${border})`);
  }
  await send("Emulation.setEmulatedMedia", { features: [] });

  // 3. Captcha renders on direct load and after Home -> About -> Home.
  const captcha = () => ev(`(() => { const i = document.querySelector('#contact form input[name="cf-turnstile-response"]'); return i ? i.value.length : -1; })()`);
  await go("/", 9000);
  check("captcha token on direct load", (await captcha()) > 0);
  await ev(`document.querySelector('header a[href="/about"]').click()`); await sleep(3000);
  await ev(`document.querySelector('header a[href="/#contact"]').click()`); await sleep(7000);
  check("captcha token after in-site round trip", (await captcha()) > 0, `(at ${await ev("location.pathname + location.hash")})`);

  await go("/"); await shot("/tmp/rack-desktop-home.png");
  await go("/services/kubernetes"); await shot("/tmp/rack-desktop-service.png");
  await go("/blog/getting-started-with-kubernetes"); await shot("/tmp/rack-desktop-post.png");
  ws.close();
} finally { chrome.kill(); }
process.exit(failed ? 1 : 0);
```

Expected: fiecare linie începe cu `ok`, cod de ieșire 0. Deschide cele patru capturi din `/tmp/rack-*.png` și compară-le cu mockup-ul aprobat: email crem pe fundal închis, text în relief, afișaj olive, porturi, tastă roșie, un singur accent.

Pentru orice `FAIL`: găsește cauza în CSS sau în componentă, corecteaz-o, rulează `npm test` și scriptul din nou.

- [ ] **Step 4: Lighthouse mobil**

```bash
for pair in "home:/" "ru:/ru" "service:/services/kubernetes" "about:/about" "post:/blog/getting-started-with-kubernetes"; do
  n=${pair%%:*}; u=${pair#*:}
  npx --yes lighthouse@12 "http://localhost:3100$u" --form-factor=mobile \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-$n.json --quiet >/dev/null 2>&1
  printf '%s: ' "$n"
  node -e 'const r=require(process.argv[1]);const c=r.categories;const bad=[];for(const k of ["accessibility","best-practices","seo"])for(const a of c[k].auditRefs){const x=r.audits[a.id];if(x.score!==null&&x.score<1&&!["informative","notApplicable","manual"].includes(x.scoreDisplayMode))bad.push(a.id)};console.log(Object.keys(c).map(k=>k+"="+Math.round(c[k].score*100)).join(" "),"| LCP",r.audits["largest-contentful-paint"].displayValue,"CLS",r.audits["cumulative-layout-shift"].displayValue,"| failing:",bad.join(",")||"none")' /tmp/lh-$n.json
done
```
Expected: `accessibility=100` pe toate; `performance` cel puțin 91 pe Home, About și pagina de serviciu; `CLS` sub 0.05. Singurele audituri picate acceptate sunt `canonical` (testul rulează pe localhost). Pentru orice alt audit picat: citește detaliile din JSON, corectează cauza și rulează din nou.

- [ ] **Step 5: Oprește serverul; Docker și Trivy**

```bash
pkill -f "next start -p 3100"
docker build --target runner -t devopsflow:rack .
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image \
  --severity CRITICAL,HIGH --scanners vuln --pkg-types library --ignore-unfixed --exit-code 1 --quiet devopsflow:rack | tail -5
```
Expected: build reușit; Trivy cu cod de ieșire 0.

- [ ] **Step 6: Raportează**

Raportează proprietarului: rezultatele pașilor 2–5, capturile, lista de commit-uri și cele trei abateri de la spec. Fără merge, push sau deploy.
