FROM ubuntu:14.04
MAINTAINER Thom Nichols "daniel.trone@state.co.us"

ADD . .

RUN apt-get -qq update && \
apt-get install -y nodejs npm postgresql-client-9.4 postgis2.1

# If you need npm, don't use a base tag
RUN npm install

EXPOSE 4000

CMD ["node", "index.js"]