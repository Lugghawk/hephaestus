FROM node:alpine

WORKDIR /app
COPY . .

RUN apk update && apk add libtool autoconf make automake gcc g++ python git

RUN npm install node-gyp -g && npm install 

CMD /app/start.sh