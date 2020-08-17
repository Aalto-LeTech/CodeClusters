#!/usr/bin/env bash

CORE_NAME="submission-search"

# Incase you wanted to query the Solr directly using the local reverse proxy for some reason, here's how:
# curl 'http://localhost:9080/_s/?q=code:*' \
#   -H 'Authorization: Bearer jwt_token_here'

case "$1" in
  bash)
    CONTAINER_ID="$(docker ps | grep solr | awk '{print $1}')"
    docker exec -it $CONTAINER_ID bash
    ;;
  data-import)
    CURL=$(curl http://localhost:8983/solr/${CORE_NAME}/dataimport?command=full-import&entity=submission)
    ;;
  reset)
    CURL=$(curl http://localhost:8983/solr/${CORE_NAME}/update?commit=true -H 'Content-Type: application/json' \
      --data-binary '{"delete":{"query":"*:*" }}')
    ;;
  restart)
    docker-compose restart solr
    ;;
  start)
    docker-compose build solr && docker-compose up -d solr
    ;;
  stop)
    docker-compose stop solr
    ;;
  delete)
    docker-compose stop solr && docker-compose rm solr && rm -r ./solr/data/*
    ;;
  logs)
    docker-compose logs -f solr
    ;;
  *)
    echo $"Usage: $0 bash|data-import|reset|start|stop|delete|logs"
    exit 1
esac
