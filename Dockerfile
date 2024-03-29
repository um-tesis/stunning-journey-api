FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/stunning-journey-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add --no-cache bash
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

RUN npm install -g webpack webpack-cli
RUN npm install -g prisma 
RUN npm install -g @prisma/client
RUN npm install -g @nestjs/cli
RUN npm install -g --save @nestjs/core @nestjs/common rxjs reflect-metadata
RUN npm install -g webpack

RUN npm install 


RUN npm install 


# Bundle app source
COPY . .

RUN prisma generate
RUN npm run build

CMD ["npm", "run", "start:dev"]
