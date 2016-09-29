#!/bin/sh
docker run -d -p 3306:3306 -e MYSQL_DATABASE=Tekuma_artworkdb -e MYSQL_USER=Tekuma_searcher -e MYSQL_PASSWORD=deadbeef -e MYSQL_RANDOM_ROOT_PASSWORD=yes mysql:latest

while true; do
    sleep 2
    if mysql -uTekuma_searcher --password=deadbeef --host=127.0.0.1 < tests/initdb.sql; then
        break
    fi
done
