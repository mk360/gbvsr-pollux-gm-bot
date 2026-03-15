FROM node:25-alpine AS builder

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm i

FROM node:25-alpine AS runner
WORKDIR /app
COPY --from=builder /src .
COPY index.js roster.js gm-command.js ./

ENTRYPOINT [ "node", "/app/index.js" ]