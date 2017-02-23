#!/bin/sh -e
# Copyright 2016, 2017 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# prep and rsync to site

if [ $(git status -s -uno | wc -l) -gt 0 ]; then
    echo "repo working tree is not clean; aborting deployment."
    exit 1
fi
sed -i s/local-test-dbconf.json/remote-dbconf.json/g serv/server-config.json
rsync -v --exclude=.git --exclude=node_modules --exclude=extern --delete -z -a -e 'ssh -i serv/cert/trial-instance-key' . scottclivingston@curator.tekuma.io:/home/scottclivingston/curator-portal
