FROM alpine:3.14

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

RUN apk add --update nodejs npm

# RUN addgroup -S node && adduser -S node -G node

# USER node

COPY ./app /app

RUN npm install

EXPOSE 3000 

# CMD [ "node", "" ]

# CMD npm run dev