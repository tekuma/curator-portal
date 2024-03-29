#!/bin/sh
docker run -d -p 127.0.0.1:3307:3306 -e MYSQL_DATABASE=Tekuma_artworkdb -e MYSQL_USER=Tekuma_searcher -e MYSQL_PASSWORD=deadbeef -e MYSQL_RANDOM_ROOT_PASSWORD=yes mysql:latest

while true; do
    sleep 2
    if echo 'use Tekuma_artworkdb' | cat - conf/initdb.sql | sed 's/^.*$/\0;/' | mysql -uTekuma_searcher --password=deadbeef --host=127.0.0.1 --port=3307; then
        break
    fi
done
