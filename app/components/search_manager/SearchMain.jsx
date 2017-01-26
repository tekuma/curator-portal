// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import SearchArtworkManager     from '../artwork_manager/SearchArtworkManager';
import CurationHeader           from '../headers/CurationHeader';
import SearchManager            from './SearchManager';
import ArtworkDetailBoxDialog   from '../artwork_manager/ArtworkDetailBoxDialog';


export default class SearchMain extends React.Component {
    state = {
        results       : [{  // TODO: remove placeholder info
            description  : "Much art. Very nice.",
            title        : "Best art ever",
            artist       : "Stephen White",
            album        : "best of",
            year         : 2020,
            tags         : ["#art", "Picasso", "#stuff"],
            colors       : ["#00ff00", "#ff00ff","#333300","#88a7ae","#dead19"],
            thumbnail_url: "http://photos1.blogger.com/blogger2/4695/2685/400/mujer%20ante%20el%20espejo%20picasso%201931.jpg"
        },{  // TODO: remove placeholder info
            description  : "Much art. Very nice.",
            title        : "other art",
            artist       : "Stephen White",
            album        : "best of",
            year         : 2001,
            tags         : ["#art", "Picasso", "#stuff"],
            colors       : ["#00ff00", "#ff00ff","#333300","#88a7ae","#dead19"],
            thumbnail_url: "http://photos1.blogger.com/blogger2/4695/2685/400/mujer%20ante%20el%20espejo%20picasso%201931.jpg"
        }],  // current list of search results
        command       : "",  // used for controlling artworks
        detailBoxIsOpen: false, // whether popup is open or not
        infoArtwork   : null,  // uid of displayed artworkInfo
        /*
        ## SCHEMA SKETCH
        {
        artist: String
        title: String
        description: String
        album: String
        date: String of the form YYYY-MM-DD  // date of uploading
        creation_year: Integer
        thumbnail_url: String
        tags: Array of Objects
            {
                rgb_colors: Array of Integer triples
                labels: Array of Strings
            }
        }
         */
        artworkInfo   : {  // TODO: remove placeholder info
            description  : "Much art. Very nice.",
            title        : "Starry Night",
            artist       : "Vincent Van Gogh",
            album        : "Impressionism",
            year         : 1888,
            tags         : ["#art", "impressionistic", "#impasto", "#europe", "#stars", "#tree", "#night"],
            colors       : ["#00ff00", "#ff00ff","#333300","#88a7ae","#dead19"],
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        }
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchMain");
    }

    render() {
        return(
        <div>
            <SearchArtworkManager
                detailArtwork={this.detailArtwork}
                toggleDetailBox={this.toggleDetailBox}
                command={this.state.command}
                results={this.state.results}
                managerIsOpen={this.props.managerIsOpen}
                addArtworkToBuffer={this.props.addArtworkToBuffer}
                removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
            />
            <SearchManager
                managerIsOpen={this.props.managerIsOpen}
                toggleManager={this.props.toggleManager}
                doQuery={this.doQuery}
             />
            <ArtworkDetailBoxDialog
                toggleDetailBox={this.toggleDetailBox}
                detailBoxIsOpen={this.state.detailBoxIsOpen}
                artworkInfo={this.state.artworkInfo}
             />
            <div
                onClick     ={this.props.toggleNav}
                onTouchTap  ={this.props.toggleNav}
                className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
        </div>
        );

    }

    componentDidMount() {
        console.log("+++++SearchMain");

    }

    // =============== Methods =====================

    detailArtwork = (uid) => {
        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            var payload = {
                auth: idToken,
                uid: uid
            };
            $.ajax({
                url: 'detail',
                data: payload,
                dataType: 'json',
                cache: false,
                success: this.updateInfoArtwork
            });
        });
    }

    updateInfoArtwork = (data) => {
        this.setState({ artworkInfo: data });
    }

    toggleDetailBox = () => {
        this.setState({
            detailBoxIsOpen: !this.state.detailBoxIsOpen
        })
    }

    /**
     * updates the this.state.results to be data.rows.
     * To prevent interleving of results, the state is
     * first cleared, then updated 25ms later.
     */
    updateResults = (data) => {
        this.setState({ results:[] });
        setTimeout( ()=>{
            this.setState({results: data.rows});
        }, 25);
    }

    addToProject = () => {
        this.props.addArtworksToProject();
        this.setState({command:"deselect"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.props.emptyBuffer();
    }

    /**
     * [doQuery description] TODO
     * @param  {[type]} queryString [description]
     * @return {[type]}             [description]
     */
    doQuery = (queryString, fields) => {
        if (queryString.length === 0 && (!fields || fields === {})) {
            return;
        }

        if (!fields)
            fields = {};

        var payload = {
            q: queryString
        }

        if (fields.title) {
            payload.q_title = fields.title;
        }
        if (fields.artist) {
            payload.q_artist = fields.artist;
        }
        if (fields.color_list) {
            payload.q_color_list = fields.color_list;
        }

        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            payload.auth = idToken;
            $.ajax({
                url: 'search',
                data: payload,
                dataType: 'json',
                cache: false,
                success: this.updateResults
            });
        });
    }

}
