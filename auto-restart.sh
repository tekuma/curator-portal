#!/bin/sh
#
# simple shell script for auto-restarting backend processes.
#
#
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston

export NODE_ENV=production

while true; do
    node serv/main.js&
    echo PID: $!
    wait $!
done
