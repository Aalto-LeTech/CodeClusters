# The builder image
FROM node:16.10.0-alpine3.11 as builder

# Set NODE_ENV to build so that all devDependencies are fetched and tslint won't fail
ENV NODE_ENV build
ENV REACT_APP_API_URL /api
# Disable creating source map so that source code isn't readable from the frontend
ENV GENERATE_SOURCEMAP false

WORKDIR /usr/codeclusters-frontend

COPY shared ./shared
WORKDIR /usr/codeclusters-frontend/shared 
RUN yarn link

WORKDIR /usr/codeclusters-frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./frontend/tsconfig.json ./frontend/tsconfig.prod.json ./frontend/.eslintrc.json ./
RUN yarn link shared
RUN yarn

COPY ./frontend/src ./src
COPY ./frontend/public ./public
COPY ./frontend/nginx ./nginx

# Set NODE_ENV to production so that all optimization flags from react-scripts are enabled
ENV NODE_ENV production
RUN yarn build

# The production image
FROM nginx:1.23.1-alpine

ENV HTTP_PORT 80

COPY --from=builder /usr/codeclusters-frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/codeclusters-frontend/nginx/nginx.conf /etc/nginx/

EXPOSE ${HTTP_PORT}
# Run the nginx without daemon to keep the process and the container bound together
# This way when nginx fails the container fails 
CMD ["nginx", "-g", "daemon off;"]