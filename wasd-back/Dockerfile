FROM node:lastest

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

ADD . /usr/src/app

ENV NODE_PATH=./build

RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]
