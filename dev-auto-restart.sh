#!/bin/sh
#
# simple shell script for auto-restarting backend processes,
# intended for development, not deployment.
#
#
# Copyright 2017 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston

export NODE_ENV=debug

kill_bk () {
    kill ${child_pid}
    exit
}
trap kill_bk INT

while true; do
    node serv/main.js --firebase-mockup &
    child_pid=$!
    echo PID: ${child_pid}
    wait $!
done
