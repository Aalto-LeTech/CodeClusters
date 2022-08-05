FROM node:16.10.0-alpine3.11

WORKDIR /usr/codeclusters-generator

COPY ./src ./package.json ./
RUN npm i

CMD ["npm", "run", "seed"]