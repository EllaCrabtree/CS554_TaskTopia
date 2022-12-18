FROM alpine:latest
RUN apk add --no-cache nodejs npm

WORKDIR /app-client
COPY . /app-client

RUN npm install