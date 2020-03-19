#!/usr/bin/env bash

case "$1" in
  bash)
    CONTAINER_ID="$(docker ps | grep solr | awk '{print $1}')"
    docker exec -it $CONTAINER_ID bash
    ;;
  data-import)
    CURL=$(curl http://localhost:8983/solr/gettingstarted/dataimport?command=full-import&entity=submission)
    ;;
  start)
    docker-compose build solr && docker-compose up -d solr
    ;;
  stop)
    docker-compose stop solr
    ;;
  delete)
    docker-compose stop solr && docker-compose rm solr && rm -r ./solr/data
    ;;
  logs)
    docker-compose logs -f solr
    ;;
  *)
    echo $"Usage: $0 bash|data-import|start|stop|delete|logs"
    exit 1
esac
