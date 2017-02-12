#!/bin/sh -e
# Copyright 2017 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# fetch and install various tools that are required for testing and
# that are not easily or reliably available through package management
# of the host system.

# exit immediately if error
set -e


SELENIUM_SERVER_FILE=selenium-server-standalone-2.52.0.jar


mkdir -p extern
if [ ! -f extern/${SELENIUM_SERVER_FILE} ]; then
    curl -L https://selenium-release.storage.googleapis.com/2.52/${SELENIUM_SERVER_FILE} -o extern/${SELENIUM_SERVER_FILE}
fi

if ! echo "dc99032c4fe9ff21cb16dbe49be69cece2281213f1ee805e48660726c8b57db756ed9f6d6a39f211e10381ae22aa08764fcb388f97cc40e4ed0afe38d1605e24  extern/${SELENIUM_SERVER_FILE}" | shasum -a 512 -c; then
    echo "ERROR: Unexpected file hash"
    rm -f extern/${SELENIUM_SERVER_FILE}
fi
