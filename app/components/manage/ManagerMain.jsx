// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ProjectArtworkManager from '../artwork_manager/ProjectArtworkManager';
import ProjectManager from './ProjectManager';
import CurationHeader from '../headers/CurationHeader';



export default class ManagerMain extends React.Component {
    state = {
        projectArtworks: [],
        artworkBuffer :[],
        currentProject:[]
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManagerMain");
    }

    render() {
        return(
            <div className={this.props.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                <CurationHeader
                    role={this.props.role}
                    currentProject={this.state.currentProject}
                    changeProject={this.changeProject}
                    projects={this.props.projects}
                />
              <ProjectArtworkManager
                    projectArtworks={this.state.projectArtworks}
                    managerIsOpen={this.props.managerIsOpen}
                    addArtworkToBuffer={this.addArtworkToBuffer}
                    removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                />
                <ProjectManager
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
        console.log("+++++ManagerMain");
    }

    componentWillReceiveProps(updates){
        //pass
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
    deleteArtworksFromProject = () => {
        let updates = this.state.artworkBuffer;
        console.log(">>adding artworks");

        let projectID  = this.state.currentProject[1]; // index 1 is the ID
        let projectRef = `projects/${projectID}`

        firebase.database().ref(projectRef).transaction((node)=>{
            if (!node.artworks) {
                node.artworks = [];
            }
            let projectArt = new Set(node.artworks);
            for (var i = 0; i < updates.length; i++) {
                let update = updates[i];
                projectArt.delete(update);
            }
            node.artworks = Array.from(projectArt);
            console.log(node.artworks);
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
        });
    }


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
     * Sets state.projectIDs as an array of all projectIDs of projects which
     * this user has access to.
     */


}
