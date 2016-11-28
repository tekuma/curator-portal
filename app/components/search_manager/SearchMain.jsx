// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import SearchArtworkManager from '../artwork_manager/SearchArtworkManager';
import CurationHeader       from '../headers/CurationHeader';
import SearchManager        from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results       : [{title: "Mona Lisa", uid: "abc123", artist_uid:"deadbeef"}, {title: "Art", uid: "adc231", artist_uid:"decaf"}], // current list of search results
        currentProject: [],  // name of current project ["name", "ID"]
        artworkBuffer : [],  // a list of all artworks currently "selected"
        command       : ""   // used for controlling artworks
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchMain");
    }

    render() {
        return(
            <div className={this.props.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                <CurationHeader
                    role={this.props.role}
                    currentProject={this.state.currentProject}
                    changeProject={this.changeProject}
                    projects={this.props.projects}
                    addArtworksToProject={this.addArtworksToProject}
                />
                <SearchArtworkManager
                    command={this.state.command}
                    results = {this.state.results}
                    managerIsOpen={this.props.managerIsOpen}
                    addArtworkToBuffer={this.addArtworkToBuffer}
                    removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                />
                <SearchManager
                    managerIsOpen={this.props.managerIsOpen}
                    toggleManager={this.props.toggleManager}
                    doQuery={this.doQuery}
                 />
                <div
                    onClick     ={this.toggleNav}
                    onTouchTap  ={this.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );

    }


    componentDidMount() {
        console.log("+++++SearchMain");

    }

    // =============== Methods =====================


    /**
     * updates the this.state.results to be data.rows
     */
    updateResults = (data) => {
        this.setState({results: data.rows});
    }

    /**
     * Updates the value of this.state.currentProject
     * @param  {Object} newName [obj.label , obj.id]
     */
    changeProject = (newName) => {
        console.log(newName);
        if (newName === null) {
            this.setState({currentProject:""})
            console.log("updated project to None");
        } else {
            console.log(newName);
            let theProj = [newName.label, newName.id]
            this.setState({currentProject:theProj});
            console.log("Updated project to ->", theProj);
        }
    }

    /**
     * Will add the contents of this.state.artworkBuffer into the project
     * inside of the firebase DB.
     * Duplicates are ignored, and order is un-important.
     */
    addArtworksToProject = () => {
        firebase.database().ref();
        let updates = this.state.artworkBuffer;
        console.log(">>adding artworks");

        let projectID  = this.state.currentProject[1]; // index 1 is the ID
        let projectRef = `projects/${projectID}`
        console.log(projectRef);
        firebase.database().ref(projectRef).transaction((node)=>{
            if (!node.artworks) {
                node.artworks = {};
            }
            for (var i = 0; i < updates.length; i++) {
                let update = updates[i]
                let id = update.uid
                node.artworks[id] = update
            }
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
            this.deselectAllArt();
        });
    }

    deselectAllArt = () => {
        this.setState({command: "deselect"});
        this.setState({command: "",artworkBuffer:[]});
    }

    /**
     *
     * @param {[type]} artwordUID [description]
     */
    addArtworkToBuffer = (artwork) => {
        console.log(this.state.artworkBuffer);
        let buffer = new Set(this.state.artworkBuffer);
        buffer.add(artwork);
        let theBuffer = Array.from(buffer);
        this.setState({artworkBuffer:theBuffer});
    }

    removeArtworkFromBuffer = (artwork) => {
        console.log("Remove,before",this.state.artworkBuffer);
        let buffer = new Set(this.state.artworkBuffer);
        buffer.delete(artwork);
        let theBuffer = Array.from(buffer);
        this.setState({artworkBuffer:theBuffer});
    }

    /**
     * [doQuery description] TODO
     * @param  {[type]} queryString [description]
     * @return {[type]}             [description]
     */
    doQuery = (queryString) => {
        if (queryString.length === 0) {
            return;
        }

        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            console.log(">> Query String:", queryString);
            $.ajax({
                url: ('search?q='
                      +queryString.replace('&', ' and ')
                      +'&auth='+idToken.replace('&', ' and ')),
                dataType: 'json',
                cache: false,
                success: this.updateResults
            });
        });
    }

}
