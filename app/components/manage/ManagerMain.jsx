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
        artworkBuffer  : [],
        currentProject : [],
        command        : "",
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
                    addNewProject={this.addNewProject}
                    projects={this.props.projects}
                    deleteArtworksFromProject={this.deleteArtworksFromProject}
                />
              <ProjectArtworkManager
                    command={this.state.command}
                    projectArtworks={this.state.projectArtworks}
                    managerIsOpen={this.props.managerIsOpen}
                    addArtworkToBuffer={this.addArtworkToBuffer}
                    removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                />
                <ProjectManager
                    managerIsOpen={this.props.managerIsOpen}
                    toggleManager={this.props.toggleManager}
                    changeProject={this.props.changeProject}
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
        this.fetchProjectArtworks();
    }

    componentWillReceiveProps(updates){
        //pass
    }

    // =============== Methods =====================

    /**
     * This method sets the state.command to be "select",
     * just for an instant. This is then sent down the tree to
     * Artwork.jsx, where it can mutate the state of artwork.
     */
    selectAllArt = () => {
        let buffer = this.state.projectArtworks;
        this.setState({command:"select"});
        this.setState({command:"",artworkBuffer:buffer})
    }
    deselectAllArt = () => {
        this.setState({command:"deselect"});
        this.setState({command:"",artworkBuffer:[]});
    }

    /**
     *
     */
    renameCurrentProject = (newName) => {
        //TODO
    }

    /**
     * Creates a new project, then sets the current project to it.
     */
    addNewProject = () => {
        // create project
        // let projectID = this.props.createNewProject();
        let projectID="-KXg6HnMtZIgrNV059mI";
        // give user access to project
        let path = `users/${firebase.auth().currentUser.uid}/projects`;
        firebase.database().ref(path).transaction((node)=>{
            // the refrenced 'node' of the nosql data tree
            node.push(projectID);
            let theProj = {label:"New Project", id:projectID};
            // update current project to be the new project
            this.changeProject(theProj);
            return node;
        });
    }


    /**
     * Updates the value of this.state.currentProject
     * @param  {Array} newName [name , id]
     */
    changeProject = (newName) => {
        if (newName === null) {
            this.setState({currentProject:""})
            console.log("updated project to None");
        } else {
            let theProj = [newName.label,newName.id]
            this.setState({currentProject:theProj});
            setTimeout( ()=>{ // wait for state to update
                this.fetchProjectArtworks();
                console.log("Changing project..-->",theProj);
            }, 50);
        }
    }

    /**
     * When called, will fetch all artworks from the Project
     * in the firebase database.
     */
    fetchProjectArtworks = () => {
        console.log("fetching...");
        if (this.state.currentProject.length == 2) {
            console.log("not null");
            console.log(this.state.currentProject);
            let projectID = this.state.currentProject[1];
            let path = `projects/${projectID}`
            console.log(path);
            firebase.database().ref(path).on("value", (snapshot)=>{
                let art = [];
                let node = snapshot.val();
                console.log("here", node);

                for (var key in node.artworks) { // obj -> array
                    if (node.artworks.hasOwnProperty(key)) {
                        art.push(node.artworks[key]);
                    }
                }
                this.setState({projectArtworks:art});
            });
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
                node.artworks = {};
            }

            for (var i = 0; i < updates.length; i++) {
                let update = updates[i];
                let id = update.uid; // uid or id ?
                node.artworks[id] = null; //delete
            }
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
        });
    }


    addArtworkToBuffer = (artwork) => {
        let buffer = this.state.artworkBuffer;
        buffer.push(artwork);
        this.setState({artworkBuffer:buffer});
    }

    removeArtworkFromBuffer = (artwork) => {
        let buffer = new Set(this.state.artworkBuffer);
        buffer.delete(artwork);
        let theBuffer = Array.from(buffer);
        this.setState({artworkBuffer:theBuffer});
    }

}
