FROM node:18-alpine
MAINTAINER MrFentazis 'lpmrfentazis@mail.ru'

# install deps for node-gyp
RUN apk update && apk upgrade --available 
RUN apk add --no-cache python3 make gcc g++ openssl

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY . .

RUN npm install react-scripts
RUN npm install

# https://stackoverflow.com/questions/58559074/increase-watchers-in-node-docker-image
# set inotify and start the node application, replace yar with your command
RUN echo "fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p"

EXPOSE ${PORT}

RUN npm run build
#CMD ["npm", "start"]


