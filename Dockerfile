# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

# ============================================
# Stage 2: Test runner
# ============================================
FROM deps AS test
WORKDIR /app

COPY . .
RUN npm run type-check
RUN npm run lint
RUN npm test

# ============================================
# Stage 3: Build
# ============================================
FROM deps AS builder
WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# Stage 4: Production
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]