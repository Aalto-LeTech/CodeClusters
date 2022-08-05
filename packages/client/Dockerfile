#####################
# The Node.js image #
#####################
FROM node:16.10.0-alpine3.11 as builder

ENV BUILD_PATH /usr/local/codeclusters_client
ENV REACT_APP_API_URL /api
# Disable creating source map so that source code isn't readable from the frontend
ENV GENERATE_SOURCEMAP false

WORKDIR ${BUILD_PATH}

RUN npm install -g pnpm@7

COPY package.json tsconfig.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy package.jsons first to cache pnpm install to run only if they were changed, not on source file changes
COPY packages/client/package.json ./packages/client/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN pnpm i --frozen-lockfile --filter @codeclusters/client \
  --filter @codeclusters/types

COPY packages/types ./packages/types
RUN pnpm --filter @codeclusters/types build

COPY packages/client ./packages/client

ENV NODE_ENV production

RUN pnpm --filter @codeclusters/client build

###################
# The Nginx image #
###################
FROM nginx:1.23.1-alpine

ENV HTTP_PORT 80
ENV BUILD_PATH /usr/local/codeclusters_client

COPY --from=builder ${BUILD_PATH}/packages/client/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder ${BUILD_PATH}/packages/client/nginx/nginx.conf /etc/nginx/

EXPOSE ${HTTP_PORT}
# Run the nginx without daemon to keep the process and the container bound together
# This way when nginx fails the container fails 
CMD ["nginx", "-g", "daemon off;"]