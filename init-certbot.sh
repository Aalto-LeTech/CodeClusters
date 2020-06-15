#!/usr/bin/env bash

# A minimal script to launch Let's Encrypt & nginx reverse proxy
# modified from https://github.com/wmnnd/nginx-certbot/blob/master/init-letsencrypt.sh

sudo docker-compose -f prod-docker-compose.yml up -d

sudo cp prod-reverse-proxy/ssl-dhparams.pem ./data/certbot/conf

sudo docker-compose -f prod-docker-compose.yml run --rm --entrypoint "\
  mkdir -p /etc/letsencrypt/live/codeclusters.cs.aalto.fi" certbot

sudo docker-compose -f prod-docker-compose.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
    -keyout '/etc/letsencrypt/live/codeclusters.cs.aalto.fi/privkey.pem' \
    -out '/etc/letsencrypt/live/codeclusters.cs.aalto.fi/fullchain.pem' \
    -subj '/CN=localhost'" certbot

sudo docker-compose -f prod-docker-compose.yml up --force-recreate -d reverse_proxy

sudo docker-compose -f prod-docker-compose.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/codeclusters.cs.aalto.fi && \
  rm -Rf /etc/letsencrypt/archive/codeclusters.cs.aalto.fi && \
  rm -Rf /etc/letsencrypt/renewal/codeclusters.cs.aalto.fi.conf" certbot

sudo docker-compose -f prod-docker-compose.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --register-unsafely-without-email \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal \
    -d codeclusters.cs.aalto.fi" certbot

sudo docker-compose -f prod-docker-compose.yml up --force-recreate -d reverse_proxy
