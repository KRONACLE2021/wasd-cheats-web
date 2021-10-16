FROM node:10.13.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

ADD . /usr/src/app

ENV NODE_PATH=./build

RUN npm run build

CMD [ "npm", "start" ]
EXPOSE 80