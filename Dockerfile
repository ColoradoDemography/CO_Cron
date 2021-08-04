FROM ubuntu:20.04
MAINTAINER Todd Bleess "todd.bleess@state.co.us"



ADD . .
  
RUN apt-get update && apt-get install -y wget curl gnupg2 && \
#curl –o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash - && \
curl -sL https://deb.nodesource.com/setup_14.x | -E bash - && \
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add - && \
#DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata && \
apt-get update && \
apt-get install -y nodejs postgresql-12-postgis-3 zip php php-pgsql

# If you need npm, don't use a base tag
RUN npm install

CMD ["nodejs", "index.js"]
