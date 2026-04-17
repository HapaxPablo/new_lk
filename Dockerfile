# ---------- Dependencies + Build ----------
FROM node:24.12.0-alpine AS builder

WORKDIR /app

# Аргумент для инвалидации кэша (можно передавать при сборке)
ARG CACHE_BUST=1
# Опционально: дата сборки для полной инвалидации
ARG BUILD_DATE

# Лучше объединить очистку с установкой зависимостей
COPY package.json package-lock.json ./

# Очистка кэша npm и установка зависимостей в одной инструкции
# Это гарантирует свежую установку при каждом изменении CACHE_BUST
RUN echo "Cache bust: ${CACHE_BUST}" && \
    npm cache clean --force && \
    npm ci --include=optional --legacy-peer-deps || \
    npm i --include=optional --legacy-peer-deps

# Копируем проект
COPY . .

# Build args
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRICA_ID

# ENV для билда
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRICA_ID=$NEXT_PUBLIC_YANDEX_METRICA


# Сборка Next.js с инвалидацией кэша через аргумент
RUN echo "Build date: ${BUILD_DATE}" && \
    npm run build

# ---------- Production ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Создаём пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем только нужное из билда
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на non-root
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Runtime ENV
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRICA_ID

ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRICA_ID=$NEXT_PUBLIC_YANDEX_METRICA


CMD ["node", "server.js"]