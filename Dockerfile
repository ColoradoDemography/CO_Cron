#FROM ubuntu:20.04
FROM node:8.12-alpine
MAINTAINER Todd Bleess "todd.bleess@state.co.us"



ADD . .
  
RUN apk update && apk add -update wget curl gnupg2 && \
#curl –o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash - && \
curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add - && \
DEBIAN_FRONTEND="noninteractive" apk add -update tzdata && \
apk update && \
apk add -update nodejs postgresql-12-postgis-3 zip php php-pgsql

# If you need npm, don't use a base tag
#RUN npm install -g node-gyp
RUN npm install

CMD ["nodejs", "index.js"]
