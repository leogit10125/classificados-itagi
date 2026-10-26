#!/bin/sh
set -e

APP_PORT="${APP_PORT:-8080}"
export PORT=3000
export BACKEND_PORT=3000

# Garante que a pasta de execução do Nginx exista
mkdir -p /run/nginx /var/log/nginx

# Ajusta a porta no arquivo correto do Nginx (sem travar se não achar)
sed -i "s/listen [0-9][0-9]*;/listen ${APP_PORT};/" /etc/nginx/nginx.conf 2>/dev/null || true
sed -i "s/listen [0-9][0-9]*;/listen ${APP_PORT};/" /etc/nginx/http.d/default.conf 2>/dev/null || true

# Inicia o backend em segundo plano
node /app/backend/server.js &

# Inicia o Nginx em primeiro plano (mantém o container vivo para sempre)
exec nginx -g "daemon off;"
