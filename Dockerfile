FROM ubuntu:14.04
MAINTAINER Todd Bleess "todd.bleess@state.co.us"



ADD . .
  
RUN apt-get update && apt-get install -y wget curl && \
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && \
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" >> /etc/apt/sources.list.d/postgresql.list' && \
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - && \
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1655A0AB68576280 && \
apt-get update && \
apt-get install -y nodejs postgresql-9.4-postgis-2.4 postgis zip php5 php5-pgsql

# If you need npm, don't use a base tag
RUN npm install

CMD ["nodejs", "index.js"]
