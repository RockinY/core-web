FROM node:8.11.1

LABEL maintainer="bran@feedmob.com"

ENV REACT_APP_WS_URI=wss://www.liangboyuan.pub/websocket
ENV REACT_APP_API_URI=https://www.liangboyuan.pub/api
ENV REACT_APP_MAINTENANCE_MODE=disabled

WORKDIR /app

# Only copy package.json and yarn.lock instead of all files
COPY package.json ./
COPY yarn.lock ./

# Do not install devDependencies
RUN yarn install
RUN yarn global add serve

# Bundle app source
COPY . .

# Prepare env
RUN touch .env
RUN env > .env

# Build the app
RUN yarn run build

EXPOSE 5000

# Start the server
CMD [ "serve", "-s", "build" ]
