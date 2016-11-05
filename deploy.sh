#!/bin/sh
# Copyright 2016 Tekuma Inc.
# All rights reserved.
# created by Scott C. Livingston
#
#
# rsync to site

rsync --exclude=.git --exclude=app --delete -z -a -e 'ssh -i serv/cert/trial-instance-key' . scottclivingston@curator.tekuma.io:/home/scottclivingston/curator-portal
