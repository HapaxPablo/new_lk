# ---------- Dependencies + Build ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Cache bust
ARG CACHE_BUST=1
ARG BUILD_DATE

# Системные переменные (build args)
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRICA_ID
ARG NEXT_PUBLIC_API_1C_URL
ARG SITE_URL
ARG NEXT_PUBLIC_MAP_STYLE_URL
ARG MAP_STYLE_URL

# Делаем их доступными для Next.js build
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRICA_ID=$NEXT_PUBLIC_YANDEX_METRICA_ID
ENV NEXT_PUBLIC_API_1C_URL=$NEXT_PUBLIC_API_1C_URL
ENV SITE_URL=$SITE_URL
ENV NEXT_PUBLIC_MAP_STYLE_URL
ENV MAP_STYLE_URL

# Установка зависимостей
COPY package.json package-lock.json ./

RUN echo "Cache bust: ${CACHE_BUST}" && \
    npm cache clean --force && \
    npm ci --include=optional --legacy-peer-deps || \
    npm i --include=optional --legacy-peer-deps

# Копируем проект
COPY . .

# DEBUG (временно можно оставить)
RUN echo "Build date: ${BUILD_DATE}" && \
    echo "SITE_URL=$NEXT_PUBLIC_SITE_URL" && \
    echo "NEXT_PUBLIC_API_1C_URL=$NEXT_PUBLIC_API_1C_URL"

# Сборка
RUN npm run build


# ---------- Production ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Non-root пользователь
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем результат сборки
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Runtime args (если вдруг нужны на сервере)
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRICA_ID
ARG NEXT_PUBLIC_API_1C_URL
ARG SITE_URL
ARG NEXT_PUBLIC_MAP_STYLE_URL
ARG MAP_STYLE_URL

# Runtime ENV (для server-side)
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRICA_ID=$NEXT_PUBLIC_YANDEX_METRICA_ID
ENV NEXT_PUBLIC_API_1C_URL=$NEXT_PUBLIC_API_1C_URL
ENV SITE_URL=$SITE_URL
ENV NEXT_PUBLIC_MAP_STYLE_URL
ENV MAP_STYLE_URL

ENV PORT=3000
EXPOSE 3000

USER nextjs

CMD ["node", "server.js"]