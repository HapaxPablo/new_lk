# Install dependencies only when needed 
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
RUN npm run build

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
ARG API_1C_URL
ARG CRYPTO_SECRET_KEY
ARG CRYPTO_IV
ARG SECRET_COOKIE_PASSWORD
ENV API_1C_URL=$API_1C_URL
ENV CRYPTO_SECRET_KEY=$CRYPTO_SECRET_KEY
ENV CRYPTO_IV=$CRYPTO_IV
ENV SECRET_COOKIE_PASSWORD=$SECRET_COOKIE_PASSWORD
CMD ["node", "server.js"]
