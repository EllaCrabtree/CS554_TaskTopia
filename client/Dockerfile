FROM alpine:latest
RUN apk add --no-cache nodejs npm
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
WORKDIR /app

COPY . /app

RUN npm install
RUN npm i -g node-sass

EXPOSE 3000

RUN ["npm", "rebuild", "node-sass"]
CMD ["npm", "start"]