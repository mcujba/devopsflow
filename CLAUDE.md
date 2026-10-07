# DevOpsFlow.io — Context Proiect

## Despre
Portal de servicii DevOps pentru Skynet Hosting SRL (Moldova, IT Park).
Domeniu: devopsflow.io

## Tech Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS 4 + shadcn/ui
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
├── i18n/
│   ├── routing.ts             # Locales: ["en", "ro", "ru"], default: "en", prefix: "as-needed"
│   ├── request.ts             # Server-side locale config
│   └── navigation.ts          # Locale-aware Link, redirect, usePathname, useRouter
├── content/blog/              # MDX blog posts ({slug}.{locale}.mdx)
├── proxy.ts                    # next-intl locale proxy (fostul middleware.ts)
└── __tests__/                 # Vitest tests (home, shell, services, about, blog, seo, sitemap, messages, not-found)
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
- shadcn/ui pentru componente UI de bază
- Server Components implicit; "use client" doar pentru meniul mobil (ui/sheet), comutatoarele de temă/limbă și formularul de contact

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

### Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Nu commite: `.claude.json`, `.mcp.json`, `node_modules/`, `.env*`
- Co-authored-by pentru commits generate cu Claude

### CI/CD
- GitHub Actions: `.github/workflows/ci-cd.yml`
- Nu există job de test în CI: workflow-ul are un singur job, iar build-ul cu `target: runner` sare peste etapa `test` din Dockerfile. Rulează local `npm run type-check && npm run lint && npm test` înainte de push
- Job `build-and-deploy`: Docker build (target: runner) → push Docker Hub → SSH deploy via `appleboy/ssh-action`
- Docker tags: `latest` + `sha-{short}`
- Deploy: SSH to production → write `.env` → `docker compose pull` + `up -d`
- Secrets necesare: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA_ID`, `PRODUCTION_ENV`, `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PASSPHRASE`, `SSH_PORT`

### Deployment
- Dockerfile multi-stage: deps → test → builder → runner (node:24-alpine)
- Next.js standalone output
- Runs as non-root user (uid 1001)
- Production: `docker-compose.prod.yml` on server, pulled image from Docker Hub
- `.env` file written from `PRODUCTION_ENV` GitHub secret (SMTP, Turnstile secret, etc.)

## Certificări de Afișat
CKA, CCNP/CCNA, LPIC-1, NSE-5/NSE-4, JNCIS-ENT/JNCIA, MTCNA/MTCWE
