# ───── Stage 1: Build ─────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# URL publique d'alak-api (backend), backee dans le bundle JS a la compilation
# (Vite n'a pas d'acces runtime aux variables d'env une fois le build fait).
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

# ───── Stage 2: Runtime ─────
FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL project="alak_digital"

USER root

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
