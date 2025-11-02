#!/bin/sh

set -e

# If VITE_SERVER_WEBSOCKET_SERVER is set
if [ -z "${VITE_SERVER_WEBSOCKET_SERVER}" ]; then
    # Replace "web.example.com" with the VITE_SERVER_WEBSOCKET_SERVER environment variable
    sed -i "s/web.example.com/${VITE_SERVER_WEBSOCKET_SERVER}/g" /usr/share/nginx/html/index.html
fi

nginx -g "daemon off;"