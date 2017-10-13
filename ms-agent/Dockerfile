FROM ubuntu:16.04

# install utilities 
RUN apt-get update && apt-get install -y \
    nano \
    git \
    wget \
    curl \
    p7zip-full \
    unzip \
    build-essential

# install nodejs 4.1
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

WORKDIR /src
