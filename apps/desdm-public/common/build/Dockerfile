# Dockerfile for des_ncsa
# Matias Carrasco Kind <mgckind@gmail.com>

FROM ubuntu:18.04
#FROM python:3.8-slim-buster

RUN apt-get update               && \
  apt-get install -y                \
    python3-pip                  && \
  rm -rf /var/lib/apt/lists/*

# Basic python reqs
RUN pip3 install --no-cache-dir jira
RUN pip3 install --no-cache-dir netaddr
RUN pip3 install --no-cache-dir bcrypt
RUN pip3 install --no-cache-dir pyyaml
RUN pip3 install --no-cache-dir tornado==5.0.1
RUN pip3 install --no-cache-dir jsmin

ADD https://nodejs.org/dist/v12.14.1/node-v12.14.1-linux-x64.tar.xz /opt/node-v12.14.1-linux-x64.tar.xz
RUN tar -C /usr/local --strip-components 1 -xf /opt/node-v12.14.1-linux-x64.tar.xz
RUN npm install -g vulcanize@1.16.0

RUN useradd --create-home --shell /bin/bash des --uid 1001
USER des
WORKDIR /home/des/
COPY --chown=des:des src/des_ncsa/ .

RUN python3 vulcan.py --build

CMD [ "python3", "main.py" ]
