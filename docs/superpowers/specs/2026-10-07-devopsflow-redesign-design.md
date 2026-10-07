# DevOpsFlow — redesign „carte de vizită” (spec de design)

Data: 2026-10-07 · Branch: `feat/redesign` · Stare: în așteptarea revizuirii

## 1. Scop

Site de prezentare care aduce cereri de consultație prin formularul de contact.

- **Public**: startup-uri/SaaS internaționale și IMM-uri din Moldova/România, cu pondere egală.
- **Limbi**: EN (implicit, fără prefix), RO, RU, cu aceeași prioritate.
- **Poziționare**: inginer senior certificat (Maxim Cujba, Skynet Hosting SRL), nu agenție.
- **Acțiune principală**: „Book a free consultation”, care duce la formularul din Home.

## 2. Starea actuală (probleme de rezolvat)

- `/sitemap.xml` și `/robots.txt` răspund 404.
- Nu există JSON-LD, canonical sau Open Graph; hreflang apare doar ca header HTTP.
- Cifrele din Home se văd „0” fără JavaScript (contoare animate).
- H1 generic; nicio dovadă vizibilă în primul ecran.
- 28 de componente `"use client"` și Framer Motion pe un site aproape static.
- 550 de fișiere din `node_modules/` sunt comise în git.
- `CLAUDE.md` e învechit (spune Next.js 15, About/Contact „placeholder”).

## 3. Structura site-ului

| Rută (per limbă) | Decizie |
|---|---|
| `/` | Rescrisă: cartea de vizită completă |
| `/services/[slug]` (8) | Păstrate, șablon simplificat |
| `/about` | Păstrată, redesenată |
| `/blog`, `/blog/[slug]` | Păstrate, redesenate |
| `/services` | Eliminată; redirect 301 la `/#services` |
| `/contact` | Eliminată; redirect 301 la `/#contact` |

Redirecturile se aplică și variantelor `/ro/...` și `/ru/...`. Toate celelalte URL-uri rămân neschimbate.

### Secțiunile din Home, în ordine

1. **Hero**: pastilă cu nume, rol și CKA; H1 cu un fragment în gradient; o frază de susținere; buton principal și buton secundar („See services”).
2. **Editor de cod**: fereastră statică cu un `deploy.yml` scurt și rezultatul unui pipeline. Decorativă, marcată `aria-hidden`.
3. **Cifre** (`#proof`): 4 carduri, urmate de rândul de certificări.
4. **Servicii** (`#services`): 8 carduri cu titlu, o frază și link spre detaliu.
5. **Despre** (`#about`): fotografie, 3–4 fraze, parcurs prescurtat, link spre `/about`.
6. **Cum lucrez** (`#process`): cei 4 pași existenți.
7. **Contact** (`#contact`): formularul, emailul, timpul de răspuns.

## 4. Sistem vizual (varianta G)

Referință: mockup-ul `visual-direction-v3.html`, varianta G, în spiritul angular.dev.

- **Culori**: fundal `#0f0f11`, suprafețe `#141417`/`#17171a`, borduri `#2a2a2f`, text `#f6f5f7`, text secundar `#a3a2a9`.
- **Gradient semnătură**: `#f0060b → #cc26d5 → #7702ff`. Se folosește doar pe: fragmentul din H1, butonul principal, cifre, marca din navigare. Nu pe fundaluri mari.
- **Teme**: dark implicit; light păstrat prin aceleași tokenuri CSS (`next-themes` rămâne). Contrast AA în ambele.
- **Tipografie**: Inter Tight pentru titluri și text, JetBrains Mono pentru detalii tehnice; ambele prin `next/font/google` (self-hosted la build), cu subseturile `latin`, `latin-ext` și `cyrillic` (necesar pentru RO și RU).
- **Navigare**: bară verticală îngustă în stânga pe desktop; pe mobil, bară sus cu meniu (componenta `Sheet` existentă).
- **Forme**: butoane tip pastilă, carduri cu rază 14px și bordură de 1px.
- **Mișcare**: doar tranziții CSS scurte la hover/focus; totul dezactivat sub `prefers-reduced-motion`.

## 5. Conținut

- **Cifre** (confirmate de proprietar): 10+ ani de experiență, 10M+ cereri/zi, 60% deploy-uri mai rapide, 99.9% uptime SLA. Afișate ca text static.
- **Certificări**: CKA, CCNP/CCNA, LPIC-1, NSE-5/NSE-4, JNCIS-ENT/JNCIA, MTCNA/MTCWE, cu ID-urile existente pe `/about`.
- **Parcurs**: cel existent, **fără STM Telecom** (se elimină cheile `tl_stm_*` din toate cele 3 limbi). Angajatorii apar ca experiență, niciodată ca clienți.
- **Copy**: hero și descrierile scurte de servicii se rescriu în EN, orientate pe rezultat; apoi se traduc în RO și RU. Restul textelor se păstrează.
- **Fotografie**: fișier furnizat de proprietar. Până atunci, substitut neutru cu inițiale.
- **Regulă**: nu se adaugă cifre, clienți, testimoniale sau certificări care nu există deja în conținut.

## 6. Arhitectură tehnică

Stack neschimbat: Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, shadcn/ui, next-intl, MDX, Docker standalone, GitHub Actions.

- **Server Components implicit.** Componente client doar: meniu mobil, comutator de temă, comutator de limbă, formular de contact.
- **Se elimină**: `framer-motion`, `motion-provider.tsx`, `terminal-animation.tsx`, contoarele animate, paginile și componentele `services-hero`, `services-grid`, `services-cta`, `services-preview`.
- **Se păstrează neschimbate funcțional**: `src/app/actions/contact.ts` (Turnstile, nodemailer, zod), `src/lib/blog.ts`, `src/i18n/*`, `middleware.ts`.
- **`src/lib/services.ts`**: rămâne sursa unică pentru cele 8 servicii; câmpurile `gradient` și `accentBg` se elimină, fiindcă noul design are un singur gradient.
- **Dependențe noi**: niciuna.

### Componente noi sau rescrise

| Unitate | Rol |
|---|---|
| `layout/side-rail`, `layout/mobile-bar` | Navigare desktop și mobil |
| `sections/hero` | Pastilă, H1, butoane |
| `sections/code-window` | Editorul static |
| `sections/proof` | Cifre și certificări |
| `sections/services` | Grila de 8 carduri |
| `sections/about-teaser` | Fotografie, text, parcurs scurt |
| `sections/process` | 4 pași |
| `sections/contact` | Înfășoară `contact-form` |
| `lib/seo.ts` | Constructori pentru metadate și JSON-LD |

## 7. SEO

- `src/app/sitemap.ts`: toate rutele × 3 limbi, cu `alternates.languages`.
- `src/app/robots.ts`: permite tot, indică sitemap-ul.
- `metadataBase`, canonical și hreflang (inclusiv `x-default`) în HTML pe fiecare pagină.
- Open Graph și Twitter Card, cu imagine generată prin `opengraph-image.tsx`.
- JSON-LD: `Person` + `ProfessionalService` pe Home; `Service` + `BreadcrumbList` pe paginile de servicii; `BlogPosting` pe articole.
- Un singur H1 pe pagină; titluri și descrieri unice per pagină și per limbă.

## 8. Tratarea erorilor

- Formularul păstrează mesajele de validare și de eroare existente, traduse.
- Pagină `not-found` localizată, în noul stil, cu link spre Home.
- Slug necunoscut de serviciu sau articol → `notFound()` (comportamentul actual).

## 9. Verificare

- `npm run type-check`, `npm run lint`, `npm test` trec.
- Teste Vitest: actualizate pentru Home, servicii, blog; noi pentru sitemap, robots, redirecturi, JSON-LD și absența cheilor `tl_stm_*`.
- Lighthouse mobil pe build-ul de producție, local: Performance ≥ 95, SEO 100, Accessibility ≥ 95, Best Practices ≥ 95.
- Core Web Vitals țintă: LCP < 2.0s, INP < 200ms, CLS < 0.05.
- Conținutul complet al Home e prezent în HTML-ul servit (verificat cu `curl`, fără JS).
- `docker build --target runner` reușește; workflow-ul CI rămâne neschimbat.

## 10. Curățenie inclusă

- Se scot din git cele 550 de fișiere din `node_modules/` (`git rm -r --cached`).
- Se adaugă `.superpowers/` în `.gitignore`.
- Se șterg SVG-urile implicite din `public/`.
- Se actualizează `CLAUDE.md` (versiune Next.js, structură, convenții noi).

## 11. În afara scopului

CMS, pagină de prețuri, studii de caz, testimoniale, articole noi de blog, analytics nou, schimbări de infrastructură, de Dockerfile sau de pipeline de deploy.

## 12. Livrare

Totul pe `feat/redesign`. Nimic nu ajunge pe `main` sau în producție fără confirmarea explicită a proprietarului.
