# DevOpsFlow.io — Context Proiect

## Despre
Portal de servicii DevOps pentru Skynet Hosting SRL (Moldova, IT Park).
Domeniu: devopsflow.io

## Tech Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS 4, fără bibliotecă de componente; materialul e definit în src/app/globals.css
- Animații: doar tranziții CSS (dezactivate sub prefers-reduced-motion); fără Framer Motion
- MDX pentru blog content (next-mdx-remote + Shiki syntax highlighting)
- Docker multi-stage (node:24-alpine) + Docker Compose production deployment
- GitHub Actions CI/CD (build → push Docker Hub → SSH deploy)
- Vitest + Testing Library pentru teste
- ESLint 10 flat config

## Structura Proiectului
```
src/
├── app/
│   ├── sitemap.ts, robots.ts            # SEO, generate din cod
│   └── [locale]/
│       ├── layout.tsx                   # Fonturi, metadataBase, FaceplateStrip + Footer
│       ├── page.tsx                     # Home: șase module de rack (panou frontal, servicii, despre, proces, blog, contact)
│       ├── services/[slug]/page.tsx     # 8 servicii × 3 limbi
│       ├── about/page.tsx
│       ├── blog/page.tsx, blog/[slug]/page.tsx
│       ├── certifications/page.tsx      # Certificări cu perioadă, cod și link de verificare
│       ├── not-found.tsx, [...rest]/page.tsx   # 404 localizat
│       └── opengraph-image.tsx
├── components/
│   ├── rack/          # unit, faceplate-strip, lcd, port — primitivele de rack
│   ├── layout/        # footer, language-switcher
│   ├── sections/      # hero, services, about-teaser, process, blog-tray, contact, cta-band
│   ├── services/      # service-detail-hero, service-features, service-tools, related-services
│   ├── about/, blog/, contact/
│   └── json-ld.tsx
├── lib/
│   ├── site.ts        # Constante: URL, contact, cifre, certificări, navigare
│   ├── seo.ts         # Căi localizate, pageMetadata, constructori JSON-LD
│   ├── services.ts    # Registrul celor 8 servicii (key, slug, icon)
│   └── blog.ts, mdx-components.tsx
├── i18n/
│   ├── routing.ts             # Locales: ["en", "ro", "ru"], default: "en", prefix: "as-needed"
│   ├── request.ts             # Server-side locale config
│   └── navigation.ts          # Locale-aware Link, redirect, usePathname, useRouter
├── content/blog/              # MDX blog posts ({slug}.{locale}.mdx)
├── proxy.ts                    # next-intl locale proxy (fostul middleware.ts)
└── __tests__/                 # Vitest tests (home, shell, rack, services, about, blog, contact-form, design-rules, seo, sitemap, redirects, proxy, messages, not-found)
messages/
├── en.json                    # English translations
├── ro.json                    # Romanian translations
└── ru.json                    # Russian translations
docker-compose.prod.yml        # Production compose file (pulled image from Docker Hub)
.github/workflows/ci-cd.yml   # CI/CD: build-and-deploy job (SSH deploy)
```

## Convenții

### Cod
- TypeScript strict — toate tipurile definite explicit
- Componente funcționale cu hooks (nu class components)
- Tailwind pentru styling, nu CSS modules
- Fiecare secțiune de pagină stă într-un <Unit>; suprafețele și controalele folosesc clasele din globals.css (raised, inset, sheet, key, key-red, lcd, socket)
- Server Components implicit; "use client" doar pentru comutatorul de limbă și formularul de contact

### Accessibility
- `aria-hidden="true"` pe toate iconițele decorative (Lucide icons lângă text)
- Suport prefers-reduced-motion la nivel global (regulă CSS în globals.css)

### i18n
- 3 limbi: EN (default), RO, RU
- Traduceri în /messages/{locale}.json
- Componente server: `getTranslations({ locale, namespace })`
- Componente client: `useTranslations("Namespace")`
- Blog posts: fișiere MDX separate per limbă ({slug}.{locale}.mdx)
- Routing: `localePrefix: "as-needed"` (fără prefix pentru EN)

### Services Architecture
- Service registry centralizat: `src/lib/services.ts`
- 8 servicii: ci-cd, kubernetes, cloud, monitoring, security, networking, linux, consulting
- Fiecare serviciu are: key (translation prefix), slug (URL), icon
- Translation keys pattern: `{key}_title`, `{key}_desc`, `{key}_f1..f4`, `{key}_tools`
- Pagini detaliu generate static via generateStaticParams (8 slugs × 3 locales)
- Related services: următoarele 3 în array (circular, cu guard pentru overflow)
- Nu există pagină /services sau /contact: ambele redirecționează (308) la /#services și /#contact

### SEO
- Orice pagină nouă își definește metadatele cu `pageMetadata()` din `src/lib/seo.ts` (canonical, hreflang, Open Graph)
- Orice rută nouă se adaugă în `src/app/sitemap.ts`
- JSON-LD se redă doar prin `<JsonLd data={...} />`
- Cifrele și certificările afișate vin din `src/lib/site.ts`; nu se adaugă altele fără confirmarea proprietarului

### Design
- Skeuomorfic: un rack din email crem pe fundal închis. Spec: docs/superpowers/specs/2026-10-09-skeuomorphic-redesign-design.md
- O singură temă, un singur accent (roșu). Fără text în gradient, fără blur, fără butoane-pastilă, fără Inter — vezi src/__tests__/design-rules.test.ts
- Fonturi: Playfair Display (titluri), Jost (text), IBM Plex Mono (afișaj, taste)
- Articole noi: docs/blog-authoring.md

### Vizibilitate în AI
- `src/app/robots.ts` permite explicit crawlerele AI (căutare, accesări cerute de utilizator și antrenare); testul din sitemap.test.ts pică dacă vreunul e blocat
- Întrebări frecvente: `<Faq scope="home" | cheia serviciului />` redă text vizibil plus JSON-LD `FAQPage`; textele sunt în `messages/*.json` sub `Faq`, numărul lor în `src/lib/faq.ts`
- Răspunsurile se scriu doar din fapte confirmate de proprietar; fără prețuri
- Fără `llms.txt`: crawlerele AI nu îl citesc în practică
- `pageMetadata()` taie descrierile la 160 de caractere și scoate sufixul din titlurile lungi

### Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Nu commite: `.claude.json`, `.mcp.json`, `node_modules/`, `.env*`
- Co-authored-by pentru commits generate cu Claude

### CI/CD
- GitHub Actions: `.github/workflows/ci-cd.yml`
- Nu există job de test în CI: workflow-ul are un singur job, iar build-ul cu `target: runner` sare peste etapa `test` din Dockerfile. Rulează local `npm run type-check && npm run lint && npm test` înainte de push
- Job `build-and-deploy`: Docker build (target: runner) → push Docker Hub → SSH deploy via `appleboy/ssh-action`
- Docker tags: `latest` + `sha-{short}`
- Imaginea se construiește doar pentru `linux/arm64` (arhitectura serverului), pe runner ARM nativ (`ubuntu-24.04-arm`), fără QEMU
- Deploy: SSH to production → write `.env` → `docker compose pull` + `up -d`
- Secrets necesare: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA_ID`, `PRODUCTION_ENV`, `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PASSPHRASE`, `SSH_PORT`

### Deployment
- Dockerfile multi-stage: deps → test → builder → runner (node:24-alpine)
- Next.js standalone output
- Runs as non-root user (uid 1001)
- Production: `docker-compose.prod.yml` on server, pulled image from Docker Hub
- `.env` file written from `PRODUCTION_ENV` GitHub secret (SMTP, Turnstile secret, etc.)
- SMTP: `SMTP_PORT=465` folosește TLS direct, orice alt port (587) folosește STARTTLS. Unii furnizori blochează ieșirea pe 465; atunci se pune 587. Conexiunile au limită de timp, deci un server de email inaccesibil dă eroare în formular în loc să-l blocheze

## Certificări
- Sursa unică: `src/lib/certifications.ts` (nume, emitent, perioadă, cod, link de verificare, fișier). Pagina `/certifications`, subsolul, About și JSON-LD citesc de acolo.
- Fiecare certificare apare cu perioada ei de valabilitate; datele structurate listează doar cele încă valabile.
- Nu există CCNP: examenul trecut este „Implementing Cisco IP Routing”.
- Fișierele (insigne, certificate) stau în `public/certificates/`.
