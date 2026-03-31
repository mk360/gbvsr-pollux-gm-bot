FROM node:25-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json tsconfig.json /app/
COPY ./src/ /app/src/
RUN npm i
RUN npx tsc

CMD [ "node", "./lib/index.js" ]