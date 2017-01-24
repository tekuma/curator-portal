// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import SearchArtworkManager from '../artwork_manager/SearchArtworkManager';
import CurationHeader       from '../headers/CurationHeader';
import SearchManager        from './SearchManager';
import EditArtworkDialog    from '../artwork_manager/EditArtworkDialog';


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
        moreInfoIsOpen: false, // whether popup is open or not
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
            title        : "Best art ever",
            artist       : "XXX",
            album        : "best of",
            year         : 2020,
            tags         : ["#art", "Picasso", "#stuff"],
            colors       : ["#00ff00", "#ff00ff","#333300","#88a7ae","#dead19"],
            thumbnail_url: "http://photos1.blogger.com/blogger2/4695/2685/400/mujer%20ante%20el%20espejo%20picasso%201931.jpg"
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
                toggleMoreInfo={this.toggleMoreInfo}
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
            <EditArtworkDialog
                toggleMoreInfo={this.toggleMoreInfo}
                moreInfoIsOpen={this.state.moreInfoIsOpen}
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
            payload.auth = idToken;
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
        this.setState({ infoArtwork:{} });
        setTimeout( ()=>{
            this.setState({results: data.rows});
        }, 25);
    }

    toggleMoreInfo = () => {
        this.setState({
            moreInfoIsOpen: !this.state.moreInfoIsOpen
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
