DROP TABLE IF EXISTS artworks, artists, associations, labels
CREATE TABLE artworks (uid CHAR(255), title TEXT, description TEXT, date_of_addition DATETIME, date_of_creation DATETIME, thumbnail_url CHAR(255), origin CHAR(32), reverse_lookup CHAR(255), META TEXT)
CREATE TABLE artists (uid CHAR(255), artist TEXT, human_name TEXT, date_of_addition DATETIME, META TEXT)
CREATE TABLE associations (label_uid CHAR(255), object_uid CHAR(255), object_table CHAR(255))
CREATE TABLE labels (uid CHAR(255), term CHAR(255), labeltype CHAR(31))
