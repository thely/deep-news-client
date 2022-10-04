FROM node:12-alpine
WORKDIR /usr/fofa/client
COPY ./package.json .
RUN npm install
COPY . .