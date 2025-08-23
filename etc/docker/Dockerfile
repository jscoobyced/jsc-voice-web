FROM node:22-alpine AS builder

WORKDIR /app
COPY code/ ./

ARG VITE_APP_NAME ${VITE_APP_NAME}
ARG VITE_APP_VERSION ${VITE_APP_VERSION}

RUN yarn --cwd code install
RUN yarn --cwd code build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY etc/docker/nginx.conf /etc/nginx/
EXPOSE 80