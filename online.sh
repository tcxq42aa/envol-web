#!/usr/bin/env bash
cd client && npm install --registry=https://registry.npm.taobao.org && npm run build
cp -r dist ../server/public
cp dist/index.ejs ../server/views
