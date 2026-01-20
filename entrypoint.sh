#!/bin/sh

set -x

# This script will read all the env variables prefixed with VITE_ on start of the container and write them to the env.js file
# The code uses this file as the env variables instead of the .env files
# This makes it possible to use a single build artifact/image for multiple environment


echo "window.env = {" > /var/www/application/config/env.js

printenv | while IFS='=' read -r key value; do
    if [[ $key == VITE* ]]; then
        echo "  \"$key\": \"$value\"," >> /var/www/application/config/env.js
    fi
done

echo "}" >> /var/www/application/config/env.js

exec "$@"