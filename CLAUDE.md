# DevOpsFlow.io — Context Proiect

## Despre
Portal de servicii DevOps pentru Skynet Hosting SRL (Moldova, IT Park).
Domeniu: devopsflow.io

## Tech Stack
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- Framer Motion pentru animații (cu MotionProvider pentru prefers-reduced-motion)
- MDX pentru blog content (next-mdx-remote + Shiki syntax highlighting)
- Docker multi-stage (node:22-alpine) + Docker Compose production deployment
- GitHub Actions CI/CD (test → build → push Docker Hub → SSH deploy)
- Vitest + Testing Library pentru teste
- ESLint 9 flat config

## Structura Proiectului
```
src/
├── app/[locale]/              # App Router pages (locale-aware)
│   ├── layout.tsx             # Root layout (ThemeProvider, MotionProvider, NextIntlClientProvider)
│   ├── page.tsx               # Home page
│   ├── services/
│   │   ├── page.tsx           # Services listing (ServicesHero + ServicesGrid + ServicesCTA)
│   │   └── [slug]/page.tsx    # Service detail (8 services × 3 locales = 24 static pages)
│   ├── blog/
│   │   ├── page.tsx           # Blog listing
│   │   └── [slug]/page.tsx    # Blog post (MDX)
│   ├── about/page.tsx         # About (placeholder)
│   └── contact/page.tsx       # Contact (placeholder)
├── components/
│   ├── layout/                # Header, Footer, LanguageSwitcher, ThemeToggle
│   ├── sections/              # Page sections (hero, stats, process, certifications, cta, services-*)
│   ├── services/              # Service detail components (service-card, service-detail-hero, service-features, service-tools, related-services)
│   ├── blog/                  # Blog components (blog-card, blog-listing-section)
│   ├── ui/                    # shadcn/ui primitives (button, sheet, separator, navigation-menu)
│   ├── theme-provider.tsx     # next-themes dark mode provider
│   └── motion-provider.tsx    # Framer Motion MotionConfig (reducedMotion="user")
├── lib/
│   ├── services.ts            # Service registry — single source of truth for all 8 services
│   ├── blog.ts                # Blog utilities (getAllPosts, getPostBySlug, getAllPostSlugs)
│   ├── mdx-components.tsx     # MDX component overrides with Tailwind styling
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
├── i18n/
│   ├── routing.ts             # Locales: ["en", "ro", "ru"], default: "en", prefix: "as-needed"
│   ├── request.ts             # Server-side locale config
│   └── navigation.ts          # Locale-aware Link, redirect, usePathname, useRouter
├── content/blog/              # MDX blog posts ({slug}.{locale}.mdx)
├── middleware.ts               # next-intl locale middleware
└── __tests__/                 # Vitest tests (home, services, blog)
messages/
├── en.json                    # English translations
├── ro.json                    # Romanian translations
└── ru.json                    # Russian translations
docker-compose.prod.yml        # Production compose file (pulled image from Docker Hub)
.github/workflows/ci-cd.yml   # CI/CD: test job + build-and-deploy job (SSH deploy)
```

## Convenții

### Cod
- TypeScript strict — toate tipurile definite explicit
- Componente funcționale cu hooks (nu class components)
- Tailwind pentru styling, nu CSS modules
- shadcn/ui pentru componente UI de bază
- Framer Motion pentru animații — toate componentele respectă prefers-reduced-motion via MotionProvider

### Accessibility
- `aria-hidden="true"` pe toate iconițele decorative (Lucide icons lângă text)
- `aria-label` pe link-uri de tip card (unde conținutul link-ului e complex)
- Suport prefers-reduced-motion la nivel global (MotionConfig reducedMotion="user")

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
- Fiecare serviciu are: key (translation prefix), slug (URL), icon, gradient, accentBg
- Translation keys pattern: `{key}_title`, `{key}_desc`, `{key}_f1..f4`, `{key}_tools`
- Pagini detaliu generate static via generateStaticParams (8 slugs × 3 locales)
- Related services: următoarele 3 în array (circular, cu guard pentru overflow)

### Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Nu commite: `.claude.json`, `.mcp.json`, `node_modules/`, `.env*`
- Co-authored-by pentru commits generate cu Claude

### CI/CD
- GitHub Actions: `.github/workflows/ci-cd.yml`
- Job `test`: checkout → Node 22 → npm ci (cache) → type-check → lint → test
- Job `build-and-deploy`: Docker build (target: runner) → push Docker Hub → SSH deploy via `appleboy/ssh-action`
- Docker tags: `latest` + `sha-{short}`
- Deploy: SSH to production → write `.env` → `docker compose pull` + `up -d`
- Secrets necesare: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `PRODUCTION_ENV`, `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT`

### Deployment
- Dockerfile multi-stage: deps → test → builder → runner (node:22-alpine)
- Next.js standalone output
- Runs as non-root user (uid 1001)
- Production: `docker-compose.prod.yml` on server, pulled image from Docker Hub
- `.env` file written from `PRODUCTION_ENV` GitHub secret (SMTP, Turnstile secret, etc.)

## Certificări de Afișat
CKA, CCNP/CCNA, LPIC-1, NSE-5/NSE-4, JNCIS-ENT/JNCIA, MTCNA/MTCWE
