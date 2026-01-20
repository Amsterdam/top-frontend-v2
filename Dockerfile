ARG NODE_VERSION=22
# Use the official Node.js image as the builder stage.
# "alpine" refers to a lightweight Linux distribution based on musl libc and BusyBox,
# known for its small size and efficiency.
FROM node:$NODE_VERSION-alpine AS builder

ARG COMMIT_HASH

ENV DIR /var/www
COPY . $DIR/
RUN ls -la $DIR

# build dirs
RUN mkdir -p $DIR/builds/application

WORKDIR $DIR
COPY package*.json $DIR/
RUN npm ci --production --unsafe-perm --ignore-scripts .

# global variables
RUN echo "REACT_APP_GIT_COMMIT_HASH=$COMMIT_HASH" > .env.local


RUN find src -type f -name "*.stories.tsx" -delete

RUN npm run build

RUN mv $DIR/dist/* $DIR/builds/application/

FROM nginx:stable-alpine

ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /var/www/builds /var/www
COPY --from=builder /var/www/env.* /var/www
COPY --from=builder /var/www/package.json /var/www/package.json

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD nginx -g 'daemon off;'
