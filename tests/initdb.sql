use Tekuma_artworkdb;
create table artworks (artist TEXT, title TEXT, description TEXT, date_of_addition DATETIME, artist_uid CHAR(255), artwork_uid CHAR(255), date_of_creation DATETIME, tags TEXT, thumbnail_url CHAR(255), origin CHAR(32), reverse_lookup CHAR(255), META TEXT);
insert into artworks (artist, title, tags) VALUES('Scott', 'deadbeef', '32bit,Intel');
insert into artworks (artist, title, tags) VALUES('Scott', 'f00f', 'hex');
