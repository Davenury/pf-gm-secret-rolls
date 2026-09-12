# ============================================
# Stage 1: Build React frontend
# ============================================
FROM node:24-alpine AS frontend-builder

WORKDIR /app/front

COPY front/package*.json ./
RUN npm ci

COPY front/ ./

RUN npm run build


# ============================================
# Stage 2: Prepare backend
# ============================================
FROM node:24-alpine AS backend-builder

WORKDIR /app/back

COPY back/package*.json ./
RUN npm ci --omit=dev

COPY back/ ./


# ============================================
# Stage 3: Final image
# ============================================
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# Backend
COPY --from=backend-builder /app/back ./back

# React production build
COPY --from=frontend-builder /app/front/build ./front/build

# Persistent application data / database
VOLUME ["/app/back/repository"]

WORKDIR /app/back

EXPOSE 8080

CMD ["node", "index.js"]