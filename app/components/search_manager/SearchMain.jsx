// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ArtworkManager from '../artwork_manager/ArtworkManager';
import CurationHeader from '../headers/CurationHeader';
import SearchManager  from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results       : [{title: "Mona Lisa", uid: "abc123", artist_uid:"deadbeef"}], // current list of search results
        currentProject: [], // name of current project ["name", "ID"]
        artworkBuffer : []  // a list of all artworks currently "selected"
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
                    currentProject={this.state.currentProject}
                    changeProject={this.changeProject}
                    projects={this.props.projects}
                    addArtworksToProject={this.addArtworksToProject}
                />
                <ArtworkManager
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

    componentWillReceiveProps(updates){
        //pass
    }

    // =============== Methods =====================


    /**
     * Sets state.projectIDs as an array of all projectIDs of projects which
     * this user has access to.
     */
    fetchProjects = () => {
        let projectIDs   = [];
        let thisUID      = firebase.auth().currentUser.uid;
        let projectsPath = `users/${thisUID}/projects`;
        firebase.database().ref(projectsPath).once('value',(snapshot)=>{
            projectIDs = snapshot.val();
            this.setState({
                projectIDs: projectIDs
            });
            this.fetchProjectNames();
        });
    }


    /**
     * updates the this.state.results to be data.rows
     */
    updateResults = (data) => {
        this.setState({results: data.rows});
    }

    /**
     * Updates the value of this.state.currentProject
     * @param  {String} newName [name of new current project]
     */
    changeProject = (newName) => {
        if (newName === null) {
            this.setState({currentProject:""})
            console.log("updated project to None");
        } else {
            let theProj = [newName.label, newName.value]
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
        let updates = this.state.artworkBuffer;
        console.log(">>adding artworks");

        let projectID  = this.state.currentProject[1]; // index 1 is the ID
        let projectRef = `projects/${projectID}`

        firebase.database().ref(projectRef).transaction((node)=>{
            if (!node.artworks) {
                node.artworks = [];
            }
            let unique = new Set(node.artworks.concat(updates));
            node.artworks = Array.from(unique);
            console.log(node.artworks);
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
        });
    }

    /**
     *
     * @param {[type]} artwordUID [description]
     */
    addArtworkToBuffer = (artwork) => {
        let buffer = new Set(this.state.artworkBuffer);
        buffer.add(artwork);
        let theBuffer = Array.from(buffer);
        this.setState({artworkBuffer:theBuffer});
    }

    removeArtworkFromBuffer = (artwork) => {
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
