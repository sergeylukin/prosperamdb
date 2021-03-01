#!/bin/sh
mkdir -p node_modules
ln -sf /save/node_modules/* ./node_modules/.
ln -sf /save/node_modules/.bin ./node_modules/.bin
ln -sf /save/node_modules/.cache ./node_modules/.cache
./node_modules/.bin/strapi develop --watch-admin --browser false
