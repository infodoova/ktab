# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_TOKEN_EXPIRY_MINUTES

RUN npm run build

# ==========================================
# Stage 2: Runtime stage (static file server)
# ==========================================
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
