#!/usr/bin/env bash

    # "db:add": "sh ./db/scripts/add-test-data.sh",
    # "db:connect": "./db/scripts/connect-to-db.sh",
    # "db:docker": "docker exec -it db_my_postgres_1 bash",
    # "db:migrate": "docker-compose -f ./db/docker-compose.yml up migrate",
    # "db:reset": "sh ./db/scripts/reset-db.sh",
    # "db:start": "docker-compose -f ./db/docker-compose.yml up",
    # "db:stop": "docker-compose -f ./db/docker-compose.yml down",

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
  *)
    echo $"Usage: $0 connect|migrate|reset|start|stop"
    exit 1
esac
