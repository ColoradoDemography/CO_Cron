FROM ubuntu:20.04
MAINTAINER Todd Bleess "todd.bleess@state.co.us"



ADD . .
  
RUN apt-get update && apt-get install -y wget curl && \
curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add - && \
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |tee  /etc/apt/sources.list.d/pgdg.list && \
DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata && \
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && \
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
apt-get update && \
apt-get install -y nodejs postgresql-12-postgis-3 zip php php-pgsql

# If you need npm, don't use a base tag
RUN nvm install 6.14.4

CMD ["nodejs", "index.js"]
