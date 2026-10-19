#!/bin/sh
set -e

APP_PORT="${APP_PORT:-8080}"

sed -i "s/listen [0-9][0-9]*;/listen ${APP_PORT};/" \
    /etc/nginx/http.d/default.conf

export PORT=3000
node /app/backend/server.js &
exec nginx -g "daemon off;"
