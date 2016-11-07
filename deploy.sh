#!/bin/sh
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# rsync to site

rsync -v --exclude=.git --exclude=app --exclude=node_modules --delete -z -a -e 'ssh -i serv/cert/trial-instance-key' . scottclivingston@curator.tekuma.io:/home/scottclivingston/curator-portal
