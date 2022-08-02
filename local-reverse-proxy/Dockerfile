FROM openresty/openresty:1.19.9.1-14-alpine-fat

ENV HTTP_PORT 80
ENV HTTPS_PORT 443

RUN opm get cdbattags/lua-resty-jwt

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY jwt-auth.lua /usr/local/openresty/lualib/resty/jwt-auth.lua

EXPOSE ${HTTP_PORT} ${HTTPS_PORT}

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]