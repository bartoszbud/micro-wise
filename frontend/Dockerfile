FROM node:22.16.0-bookworm-slim as builder

WORKDIR /opt/build

COPY . .

RUN npm cache clean --force && npm install && npm run build

FROM nginx:1.29.0

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/build/build/ /var/www/html/