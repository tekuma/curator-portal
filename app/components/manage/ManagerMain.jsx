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
        artworkBuffer  : [], // list of all 'selected' artworks
        currentProject : [], // ["Project Name", "ProjectID"]
        command        : "", // for sending actions down to Artworks
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
                    selectAllArt={this.selectAllArt}
                    deselectAllArt={this.deselectAllArt}
                    deleteCurrentProject={this.deleteCurrentProject}
                    renameCurrentProject={this.renameCurrentProject}
                    currentProject={this.state.currentProject}
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
        setTimeout( ()=>{
            this.setState({command:"",artworkBuffer:buffer})
        }, 50);
    }
    deselectAllArt = () => {
        this.setState({command:"deselect"});
        setTimeout( ()=>{
            this.setState({command:"",artworkBuffer:[]});
        }, 50);
    }

    /**
     * Renames the current project to be called newName.
     */
    renameCurrentProject = (newName) => {
        let projectID = this.state.currentProject[1];
        let path      = `projects/${projectID}`;
        firebase.database().ref(path).transaction((node)=>{
            node.name = newName
            return node;
        },(err,wasSuccessful,snapshot)=>{
            this.props.fetchProjects();
            this.setState({
                currentProject:[newName:projectID],
            })
        });
    }

    /**
     * Creates a new project, gives user rights to it, then updates current
     * project.
     */
    addNewProject = () => {
        let projectID   = this.props.createNewProject();
        let defaultName = "New Project";
        // give user access to project
        let path = `users/${firebase.auth().currentUser.uid}/projects`;
        firebase.database().ref(path).transaction((data)=>{
            // transaction should trigger PostAuth.fetchProjectNames
            if (data){
                data.push(projectID);
            } else {
                data = [projectID];
            }
             //FIXME check for duplicate with set/array ?
            return data;
        }, (err,wasSuccessful,snapshot)=>{
            // onComplete: update current project to be the new project
            let theProject = {label:defaultName, id:projectID};
            this.changeProject(theProject);
        });
    }

    /**
     * Updates the value of this.state.currentProject
     * @param  {Array} newName [name , id]
     */
    changeProject = (newName) => {
        if (newName === null) {
            this.setState({
                currentProject:"",
                projectArtworks  :[]
            });
        } else {
            let theProj = [newName.label,newName.id];
            this.setState({currentProject:theProj});
            setTimeout( ()=>{ // wait for state to update
                this.fetchProjectArtworks();
            }, 50);
        }
    }

    /**
     * Deletes the current project from the firebaseDB, removes it from
     * the user's projects, and updates the current project to none.
     */
    deleteCurrentProject = () => {
        let projectID = this.state.currentProject[1];
        let userUid   = firebase.auth().currentUser.uid;
        let userPath  = `users/${userUid}/projects`;
        firebase.database().ref(userPath).transaction((data)=>{
            let index = data.indexOf(projectID);
            data.splice(index,1);
            return data;
        });

        let projectRef = `projects/${projectID}`;
        firebase.database().ref(projectRef).remove();
        this.changeProject(null);
    }

    /**
     * When called, will fetch all artworks from the Project
     * in the firebase database. Also initiates a listener, which
     * will reactively update any changes to artworks.
     */
    fetchProjectArtworks = () => {
        if (this.state.currentProject.length == 2) { // not null

            let projectID = this.state.currentProject[1];
            let path = `projects/${projectID}`;
            firebase.database().ref(path).on("value", (snapshot)=>{
                let art = [];
                let node = snapshot.val();

                console.log(node);
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
        let updates    = this.state.artworkBuffer;
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

    /**
     * TODO
     * @param {[type]} artwork [description]
     */
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
