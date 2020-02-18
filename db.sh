#!/usr/bin/env bash

DB_HOST=localhost
DB_PORT=5600
DB_USER=pg-user
DB_PASSWORD=my-pg-password
DB_NAME=my_postgres_db

case "$1" in
  connect)
    psql postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
    ;;
  logs)
    docker-compose logs -f postgres
    ;;
  migrate)
    docker-compose up flyway_migration
    ;;
  reset)
    psql postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME} <<EOF
DROP SCHEMA audit CASCADE;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
EOF
    ;;
  start)
    docker-compose up -d postgres
    ;;
  stop)
    docker-compose stop postgres
    ;;
  testdata)
    cd ./db/generator && npm start
    ;;
  *)
    echo $"Usage: $0 connect|migrate|reset|start|stop"
    exit 1
esac
