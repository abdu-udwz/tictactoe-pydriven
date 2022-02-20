# STAGE 1: build artifacts
FROM node:lts-alpine AS build

RUN npm install -g pnpm

# set working directory
WORKDIR /build

# add `/build/node_modules/.bin` to $PATH
ENV PATH=/build/node_modules/.bin:$PATH
COPY package*.json pnpm*.yaml ./
COPY packages/app/package*.json ./packages/app/
COPY packages/server/package*.json ./packages/server/

RUN pnpm install

# bring source code
# to avoid host machine node_module replacing the container's, add node_module to .dockerignore
COPY . .

RUN pnpm build -r --stream


## STAGE SERVER
FROM build AS server

ENV PORT=${PORT:-3000}

RUN cp /build/packages/server/tsconfig.json packages/server/dist/
RUN mkdir -p packages/server/dist/src/public
RUN cp -r /build/packages/app/dist/* packages/server/dist/src/public/
 

WORKDIR /build/packages/server/dist/
# VOLUME [ "/app" ]

EXPOSE $PORT
CMD ["node", "--require=tsconfig-paths/register", "./src/bin/www.js"]