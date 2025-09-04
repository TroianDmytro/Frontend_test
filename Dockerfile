# syntax=docker/dockerfile:1

########################################
# Base dependencies stage
########################################
FROM node:23.10.0-alpine AS deps
WORKDIR /app
# Install deps separately for better layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

########################################
# Build stage
########################################
FROM node:23.10.0-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build (TypeScript + Vite)
RUN npm run build

########################################
# Runtime stage (Node-only static server)
########################################
FROM node:23.10.0-alpine AS runtime
WORKDIR /app

# Only copy the built assets (no sources needed at runtime)
COPY --from=build /app/dist ./dist

# Install a tiny static file server (serve) globally
RUN npm install --no-audit --no-fund -g serve@14

# Configurable port (default 4173 similar to vite preview)
ARG PORT=4173
ENV PORT=${PORT}
EXPOSE ${PORT}

# Basic healthcheck (adjust path if needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:${PORT} > /dev/null 2>&1 || exit 1

CMD ["serve", "-s", "dist", "-l", "${PORT}"]

########################################
# Optional: development stage (uncomment to use)
########################################
# Development stage (optional)
# FROM node:20-alpine AS dev
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host"]
