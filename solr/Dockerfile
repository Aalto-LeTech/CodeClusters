FROM solr:8.4.1

USER root

RUN mkdir /opt/solr-8.4.1/config/

USER $SOLR_USER

WORKDIR /opt/solr

COPY schema.xml data-config.xml solrconfig.xml /opt/solr-8.4.1/config/
COPY postgresql-42.2.10.jar /opt/solr-8.4.1/contrib/dataimporthandler/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["solr-foreground"]