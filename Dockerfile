FROM node:latest

ADD package.json /opt/app/
WORKDIR /opt/app
RUN npm install
EXPOSE 8582
ENTRYPOINT node index.js

ADD *.js /opt/app/

