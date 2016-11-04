#!/bin/sh
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# Spin up components for local testing. Note that nginx
# (http://nginx.org/en/docs/) must be installed locally.

echo Running from directory `pwd`
sudo nginx -c `pwd`/conf/dev-nginx.conf
nohup npm run start&
node serv/main.js
