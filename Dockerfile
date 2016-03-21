FROM ubuntu:14.04
MAINTAINER Daniel Trone "daniel.trone@state.co.us"

ADD . .
  
RUN apt-get install -y wget && \
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt trusty-pgdg main" >> /etc/apt/sources.list' && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add - && \
apt-get -qq update && \
apt-get install -y nodejs npm postgresql-9.4-postgis-2.1 postgis unzip

# If you need npm, don't use a base tag
RUN npm install

EXPOSE 4000

CMD ["nodejs", "index.js"]