# 1. Compila o React
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# 2. Prepara o Backend e junta com o React compilado
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev --no-audit --no-fund
COPY backend/ ./backend/

# Copia a pasta compilada do React direto para o backend servir
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Garante permissões adequadas
RUN chown -R node:node /app

# 🛡️ SEGURANÇA MÁXIMA: Roda como usuário sem privilégios (não-root)
USER node

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "backend/server.js"]
