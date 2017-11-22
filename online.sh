#!/usr/bin/env bash
rm -rf client/dist
rm -rf server/public/dist
cd client && npm install --registry=https://registry.npm.taobao.org && npm run build
cd ../server/ && npm install  --registry=https://registry.npm.taobao.org
cd ../
cp -r client/dist server/public
cp client/dist/index.ejs server/views
