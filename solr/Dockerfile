FROM solr:8.4.1

USER root

RUN mkdir /opt/solr-8.4.1/config/
RUN cp /opt/solr-8.4.1/example/files/conf/solrconfig.xml /opt/solr-8.4.1/config/

USER $SOLR_USER

WORKDIR /opt/solr

COPY schema.xml data-config.xml /opt/solr-8.4.1/config/
COPY postgresql-42.2.10.jar /opt/solr-8.4.1/contrib/dataimporthandler/

# RUN /opt/docker-solr/scripts/init-var-solr
# RUN . /opt/docker-solr/scripts/run-initdb
# RUN /opt/docker-solr/scripts/precreate-core submission-search /opt/solr-8.4.1/config
# RUN solr create -c submission-search -d /opt/solr-8.4.1/config

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["solr-foreground"]