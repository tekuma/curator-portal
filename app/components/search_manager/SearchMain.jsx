// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ArtworkManager from '../artwork_manager/ArtworkManager';
import CurationHeader from '../headers/CurationHeader';
import SearchManager  from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results       : ["thing1","thing2", "thing3"],          //TODO replace with firebase calls
        projects      : ["New Project", "84 Winter St", "GRT"], //TODO
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
    }

    componentWillReceiveProps(updates){

    }

    // =============== Methods =====================

    /**
     * [doQuery description] TODO
     * @param  {[type]} queryString [description]
     * @return {[type]}             [description]
     */
    doQuery = (queryString) => {
        if (updates.queryString.length === 0) {
            return;
        }

        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            console.log(">> Query String:", updates.queryString);
            $.ajax({
                url: ('search?q='
                      +String.replace(updates.queryString, '&', ' and ')
                      +'&auth='+String(idToken)),
                dataType: 'json',
                cache: false,
                success: this.updateResults
            });
        }).catch((err)=>{
            //pass
        });
    }

    /**
     * [updateResults description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
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
     * @param {[Array]} artworks [description]
     */
    addArtworksToProject = (updates) => {
        console.log(">>adding artworks");
        this.setState({artworkBuffer:updates});

        //get current project ID
        //make firebase calls
        let projectID  = "-KUd7ZoWtuWtU4XGIgXA"; //FIXME replace with this.state.currentProejctID
        let projectRef = `projects/${projectID}`
        console.log(projectRef);
        firebase.database().ref(projectRef).transaction((node)=>{
            console.log(node);
            node.artworks.push(updates);
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
        });

    }


}
