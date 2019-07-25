FROM node:10.16.0-alpine

WORKDIR /app
COPY . /app

RUN cd /app && npm install 
RUN npm run populate
RUN npm run build
CMD [ "npm", "start" ]
