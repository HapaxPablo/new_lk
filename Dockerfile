# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Устанавливаем переменные окружения для сборки
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG IRON_SESSION_PASSWORD
ARG NODE_ENV=production
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV IRON_SESSION_PASSWORD=$IRON_SESSION_PASSWORD
ENV NODE_ENV=$NODE_ENV
RUN yarn build

# Production image for Next.js
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
# Устанавливаем переменные окружения для runtime
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG IRON_SESSION_PASSWORD
ARG NODE_ENV=production
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV IRON_SESSION_PASSWORD=$IRON_SESSION_PASSWORD
ENV NODE_ENV=$NODE_ENV
CMD ["node", "server.js"]

