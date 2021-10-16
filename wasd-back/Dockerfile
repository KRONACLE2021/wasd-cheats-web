FROM node:10.13.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install
RUN npm install typescript
ADD . /usr/src/app

RUN npm run tsc

CMD [ "npm", "start" ]
EXPOSE 7001