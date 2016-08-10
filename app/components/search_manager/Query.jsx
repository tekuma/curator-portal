import react    from 'react';
import firebase from 'firebase';

// Hierarchy
// 1-Title  //sort by title, snapshot only matching title
// 2-Artist
// 3-Time
// 4-Tag
// 5-Color

const pageLimit = 1000;

let samplePrintObj = {
    source    : "portal | artcom | onex | curioos",
    title     : "Artwork Title",
    date      : "some date object",
    artist    : "artist's name";
    artist_id : "link to artist info",
    tags      : [],
    color     : [],
    id        : "portal artworkUID, artcom SKU, ",
    thumbnail : "some thumbnail url",
    printfile : "Nullable. Usually path to printfile if portal sourced",
    album     : "the album name or catagory from artcom",
    desc      : "A description of the artwork.",
    meta      : {other:"any other data from artcom,onex,etc that we don't standardize"}
};

getData = (amount,ref) => {
    ref.once('value', )
}

searchTitle = (title) =>{
    // orderby title equalTo title
    firebase.database()
            .ref('all')
            .orderByChild("title")
            .limitToFirst(pageLimit)
            .once('value')
            .then((snapshot)=>{

            });
}

searchTitleArtist = (title,artist) =>{

}

searchTitleArtistTime = (title,artist,time) => {
    
}
