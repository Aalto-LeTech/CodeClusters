# The builder image
FROM node:12.14.1-alpine as builder

# Set NODE_ENV to build so that all devDependencies are fetched and tslint won't fail
ENV NODE_ENV build
# Interesting read about where to install your program in UNIX filesystem
# https://askubuntu.com/questions/130186/what-is-the-rationale-for-the-usr-directory
ENV INSTALL_PATH /opt/my-node-bootstrap

WORKDIR ${INSTALL_PATH}

COPY package.json yarn.lock tsconfig.json tslint.json start.sh ./
RUN yarn

COPY ./src ./src

# Set NODE_ENV to production so that all optimizations are enabled
ENV NODE_ENV production
RUN yarn ts

# The Node server image
FROM node:12.14.1-alpine

LABEL maintainer="https://github.com/teemukoivisto"

ENV PORT 8600
ENV INSTALL_PATH /opt/my-node-bootstrap
ENV CORS_SAME_ORIGIN true
# the ENVs are not shared so NODE_ENV needs to be set again
ENV NODE_ENV production

# Install AWS CLI
RUN \
  mkdir -p /aws && \
  apk -Uuv add groff less python py-pip git && \
  pip install awscli && \
  apk --purge -v del py-pip && \
  rm /var/cache/apk/*

WORKDIR ${INSTALL_PATH}

COPY --from=builder ${INSTALL_PATH}/dist ./dist
COPY --from=builder ${INSTALL_PATH}/package.json ${INSTALL_PATH}/yarn.lock ${INSTALL_PATH}/start.sh ./

RUN yarn install --production

EXPOSE ${PORT}

CMD ["./start.sh"]