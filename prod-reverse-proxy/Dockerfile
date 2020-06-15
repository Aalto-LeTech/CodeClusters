FROM nginx:1.17.10-alpine

ENV HTTP_PORT 80
ENV HTTPS_PORT 443

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/

EXPOSE ${HTTP_PORT} ${HTTPS_PORT}

CMD ["nginx", "-g", "daemon off;"]