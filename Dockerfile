FROM node:17-alpine

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
RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli
RUN npm install @prisma/client
RUN npm install
RUN prisma generate
RUN npx prisma migrate dev --name init

# Bundle app source
COPY . .

ENV PORT 5000
EXPOSE 5000

CMD ["npm", "run", "start:dev"]
