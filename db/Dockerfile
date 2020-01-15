FROM flyway/flyway:6.1.3-alpine

USER root
# Install AWS CLI
RUN \
  apk -Uuv add groff less python py-pip git && \
  pip install awscli && \
  apk --purge -v del py-pip && \
  rm /var/cache/apk/*

USER flyway

COPY ./migrations /flyway/sql
COPY ./scripts/aws-migrate.sh /flyway/aws-migrate.sh

WORKDIR /flyway

ENTRYPOINT ["./aws-migrate.sh"]