FROM ubuntu:20.04
MAINTAINER Todd Bleess "todd.bleess@state.co.us"



ADD . .
  
RUN apt-get update && apt-get install -y wget curl && \
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
sudo apt -y install gnupg2 && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add - && \
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list && \
apt-get update && \
apt-get install -y nodejs postgresql-12-postgis-3 zip php5 php5-pgsql

# If you need npm, don't use a base tag
RUN npm install

CMD ["nodejs", "index.js"]
