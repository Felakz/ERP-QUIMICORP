# ── Backend Dockerfile (NestJS) ──
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package*.json ./backend/
COPY prisma ./prisma

WORKDIR /app/backend
RUN npm ci

COPY backend .
RUN npx prisma generate --schema=../prisma/schema.prisma
RUN npm run build

# ── Stage de Ejecución ──
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app/backend

ENV NODE_ENV production
ENV PORT 3001

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/prisma ../prisma

EXPOSE 3001

CMD ["node", "dist/main"]
