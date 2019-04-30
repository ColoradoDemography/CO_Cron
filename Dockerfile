FROM ubuntu:14.04
MAINTAINER Daniel Trone "daniel.trone@state.co.us"



ADD . .
  
RUN apt-get update && apt-get install -y wget curl && \
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - && \
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt trusty-pgdg main" >> /etc/apt/sources.list' && \
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add - && \
apt-get update && \
apt-get install -y nodejs postgresql-9.4-postgis-2.4 postgis zip php5 php5-pgsql

# Install Oracle Instantclient
RUN mkdir /opt/oracle \
    && cd /opt/oracle \
    && wget -qO- https://storage.googleapis.com/bls-data/instantclient-basic-linux.x64-12.2.0.1.0.zip \
    && wget -qO- https://storage.googleapis.com/bls-data/instantclient-sdk-linux.x64-12.2.0.1.0.zip \
    && unzip /opt/oracle/instantclient-basic-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && unzip /opt/oracle/instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && ln -s /opt/oracle/instantclient_12_1/libclntsh.so.12.1 /opt/oracle/instantclient_12_1/libclntsh.so \
    && ln -s /opt/oracle/instantclient_12_1/libclntshcore.so.12.1 /opt/oracle/instantclient_12_1/libclntshcore.so \
    && ln -s /opt/oracle/instantclient_12_1/libocci.so.12.1 /opt/oracle/instantclient_12_1/libocci.so \
    && rm -rf /opt/oracle/*.zip
    
# Install Oracle extensions
RUN docker-php-ext-configure pdo_oci --with-pdo-oci=instantclient,/opt/oracle/instantclient_12_1,12.1 \
       && echo 'instantclient,/opt/oracle/instantclient_12_1/' | pecl install oci8 \
       && docker-php-ext-install \
               pdo_oci \
       && docker-php-ext-enable \
               oci8

# If you need npm, don't use a base tag
RUN npm install

CMD ["nodejs", "index.js"]
