CREATE TABLE artworks (uid CHAR(255) UNIQUE, title TEXT, description TEXT, artist_uid CHAR(255), date_of_addition DATETIME, date_of_creation DATETIME, thumbnail_url CHAR(255), origin CHAR(32), reverse_lookup CHAR(255), META BLOB)
CREATE TABLE artists (uid CHAR(255) UNIQUE, artist TEXT, human_name TEXT, date_of_addition DATETIME, META BLOB)
CREATE TABLE associations (label_uid CHAR(255), object_uid CHAR(255), object_table CHAR(255))
CREATE TABLE labels (uid CHAR(255) UNIQUE, val CHAR(255), labeltype CHAR(32), origin CHAR(32), date_of_addition DATETIME)
