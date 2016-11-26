// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ArtworkManager from '../artwork_manager/ArtworkManager';
import CurationHeader from '../headers/CurationHeader';
import SearchManager  from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results       : [],
        projects      : [],
        projectIDs    : [],
        currentProject: "",
        artworkBuffer : []
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
                    projects={this.state.projects}
                    addArtworksToProject={this.addArtworksToProject}
                />
                <ArtworkManager
                    results = {this.state.results}
                    managerIsOpen={this.props.managerIsOpen}
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
        this.fetchProjects();
    }

    componentWillReceiveProps(updates){

    }

    // =============== Methods =====================
    //

    /**
     * Sets state.projectIDs as an array of all projectIDs of projects which
     * this user has access to.
     */
    fetchProjects = () => {
        let projectIDs = [];
        let thisUID    = firebase.auth().currentUser.uid;
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
     * Uses state.projectIDs to fetch the names of each project, then updates
     * state.projects with an array of strings.
     */
    fetchProjectNames = () => {
        
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
        this.setState({currentProject:newName});
        console.log("Updated project to ->", newName.label);
    }

    /**
     * Takes in artworks to be extended to existing artworks in current 'project'
     * Note that this array acts as a Set, in that only unique elements should be
     * allowed to appear. Duplicates are ignored, and order is un-important.
     * @param {Array} artworks A list of artworks currently in the project.
     */
    addArtworksToProject = (updates) => {
        console.log(">>adding artworks", updates);
        this.setState({artworkBuffer:updates});

        let projectID  = "-KUd7ZoWtuWtU4XGIgXA"; //FIXME replace with this.state.currentProejctID
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


}
