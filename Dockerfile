FROM node:10.15-alpine

ENV MC_ACCOUNTS=""

WORKDIR /var/chimp-api

COPY modules ./modules
COPY main.js .
COPY package-lock.json .
COPY package.json .

RUN set -ex; \
  npm i

EXPOSE 3000

CMD ["npm", "start"]
