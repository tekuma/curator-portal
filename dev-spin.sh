#!/bin/sh
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# Spin up components for local testing. Note that nginx
# (http://nginx.org/en/docs/) must be installed locally.

export NODE_ENV=debug

if pgrep nginx > /dev/null; then
    echo Found running nginx. Stopping it...
    sudo nginx -s stop
fi

cleanup () {
    if [ -n $webpackserv_pid ]; then
	kill $webpackserv_pid
    fi
    if [ -n $serv_pid ]; then
        kill $serv_pid
    fi
    if [ -f /run/nginx.pid ]; then
	sudo kill `cat /run/nginx.pid`
    fi
    exit
}
trap cleanup INT

echo Running from directory `pwd`
sudo nginx -c `pwd`/conf/dev-nginx.conf
npm run start > /dev/null &
webpackserv_pid=$!

node serv/main.js --firebase-mockup &
serv_pid=$!

wait
