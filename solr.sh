#!/usr/bin/env bash

DB_HOST=localhost
DB_PORT=5600
DB_USER=pg-user
DB_PASSWORD=my-pg-password
DB_NAME=my_postgres_db

case "$1" in
  bash)
    CONTAINER_ID="$(docker ps | grep solr | awk '{print $1}')"
    docker exec -it $CONTAINER_ID bash
    ;;
  logs)
    docker-compose logs -f solr
    ;;
  cp-jar)
    CONTAINER_ID="$(docker ps | grep solr | awk '{print $1}')"
    docker cp $2 $CONTAINER_ID:/opt/solr-8.4.1/contrib/dataimporthandler
    ;;
  data-import)
    DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
    CMD=$(curl http://localhost:8983/solr/dih/dataimport?command=full-import&jdbcurl=jdbc:hsqldb:./example-DIH/hsqldb/ex&jdbcuser=sa&jdbcpassword=secret)
    ;;
  start)
    docker-compose up -d solr
    ;;
  stop)
    docker-compose stop solr
    ;;
  *)
    echo $"Usage: $0 bash|logs|cp-jar|data-import|start|stop"
    exit 1
esac
