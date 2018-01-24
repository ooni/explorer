# Best practices for development, and not for a production deployment
# from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Build: run ooni-sysadmin.git/scripts/docker-build from this directory

FROM node:carbon

USER node
WORKDIR /usr/src/app

# .cache removal leads to two times smaller image and 
RUN set -ex \
    && yarn install --frozen-lockfile \
    && yarn run build \
    && rm -rf /home/node/.cache \
    && :

EXPOSE 3100

USER daemon
CMD [ "yarn", "run", "start" ]
