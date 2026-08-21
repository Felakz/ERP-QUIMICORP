# ── Frontend Dockerfile (Next.js 14) ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

COPY frontend .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ── Stage de Ejecución ──
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

COPY --from=builder /app/frontend/package*.json ./
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]
