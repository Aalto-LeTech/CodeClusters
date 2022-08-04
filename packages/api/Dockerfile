#####################
# The Node.js image #
#####################
# Not using builder image since it's quite tedious to copy / install everything all over
FROM node:16.10.0-alpine3.11

# Set NODE_ENV to build so that all devDependencies are fetched and tslint won't fail
ENV NODE_ENV build
# Interesting read about where to install your program in UNIX filesystem
# https://askubuntu.com/questions/130186/what-is-the-rationale-for-the-usr-directory
ENV INSTALL_PATH /usr/local/codeclusters_api

WORKDIR ${INSTALL_PATH}

RUN npm install -g pnpm@7

COPY package.json tsconfig.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy package.jsons first to cache pnpm install to run only if they were changed, not on source file changes
COPY packages/api/package.json ./packages/api/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN pnpm i --frozen-lockfile --filter @codeclusters/api \
  --filter @codeclusters/types

COPY packages/types ./packages/types
RUN pnpm --filter @codeclusters/types build

COPY packages/api ./packages/api
# RUN pnpm test --filter @codeclusters/api test
RUN pnpm --filter @codeclusters/api build

# RUN pnpm prune

ENV NODE_ENV production

EXPOSE ${PORT}

CMD node ./packages/api/dist/index.js