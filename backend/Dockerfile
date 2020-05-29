# The builder image
FROM node:14.3.0-alpine as builder

# Set NODE_ENV to build so that all devDependencies are fetched and tslint won't fail
ENV NODE_ENV build
# Interesting read about where to install your program in UNIX filesystem
# https://askubuntu.com/questions/130186/what-is-the-rationale-for-the-usr-directory
ENV INSTALL_PATH /opt/codeclusters-backend

WORKDIR ${INSTALL_PATH}

COPY shared ./shared
WORKDIR ./shared 
RUN yarn link

WORKDIR ${INSTALL_PATH}
COPY ./backend/package.json ./backend/yarn.lock ./backend/tsconfig.json ./backend/tslint.json ./backend/start.sh ./
RUN yarn link shared
RUN yarn

COPY ./backend/src ./src

# Set NODE_ENV to production so that all optimizations are enabled
ENV NODE_ENV production
RUN yarn ts

# The Node server image
FROM node:14.3.0-alpine

ENV PORT 8600
ENV INSTALL_PATH /opt/codeclusters-backend
ENV CORS_SAME_ORIGIN true
# the ENVs are not shared so NODE_ENV needs to be set again
ENV NODE_ENV production

WORKDIR ${INSTALL_PATH}

COPY --from=builder ${INSTALL_PATH}/dist ./dist
COPY --from=builder ${INSTALL_PATH}/shared ./shared
COPY --from=builder ${INSTALL_PATH}/package.json ${INSTALL_PATH}/yarn.lock ${INSTALL_PATH}/start.sh ./

WORKDIR ./shared
RUN yarn link

WORKDIR ${INSTALL_PATH}
RUN yarn link shared
RUN yarn install --production

EXPOSE ${PORT}

CMD ["./start.sh"]