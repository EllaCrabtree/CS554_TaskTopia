FROM alpine:latest
RUN apk add --no-cache nodejs npm

WORKDIR /app-server

COPY . /app-server

RUN npm install