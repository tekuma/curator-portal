#!/bin/sh
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# Spin up components for local testing. Note that nginx
# (http://nginx.org/en/docs/) must be installed locally.

if pgrep nginx > /dev/null; then
    echo Found running nginx. Stopping it...
    sudo nginx -s stop
fi

echo Running from directory `pwd`
sudo nginx -c `pwd`/conf/dev-nginx.conf
nohup npm run start&
node serv/main.js
