FROM node:14.3.0-alpine

WORKDIR /usr/codeclusters-generator

COPY ./generator/generator.js ./generator/package.json ./generator/package-lock.json ./
COPY ./test-data /usr/test-data
RUN yarn

CMD ["node", "generator.js"]