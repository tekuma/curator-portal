// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ProjectArtworkManager from '../artwork_manager/ProjectArtworkManager';
import ProjectManager from './ProjectManager';
import CurationHeader from '../headers/CurationHeader';
import confirm    from '../confirm_dialog/ConfirmFunction';
import ManageNotesDialog   from './ManageNotesDialog';


export default class ManagerMain extends React.Component {
    state = {
        manageNotesIsOpen:false, // whether popup is open or not
        projectNotes     :[],  // gathered notes
        users            :[]  // list of [name,uid] pairs to populate collaborators
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManagerMain");
    }

    render() {
        return(
            <div>
                <ProjectArtworkManager
                      command={this.state.command}
                      projectArtworks={this.props.projectArtworks}
                      managerIsOpen={this.props.managerIsOpen}
                      addArtworkToBuffer={this.props.addArtworkToBuffer}
                      removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                      changeAppLayout={this.props.changeAppLayout}
                      projects={this.props.projects}
                      addNewProject={this.props.addNewProject}
                      detailArtwork={this.detailArtwork}
                      toggleDetailBox={this.props.toggleDetailBox}
                      deleteArtworksFromProject={this.props.deleteArtworksFromProject}
                      addArtworksToProject={this.props.addArtworksToProject}
                      sendToSnackbar={this.props.sendToSnackbar}
                      role={this.props.role}
                  />
                  <ProjectManager
                      artworkBuffer={this.props.artworkBuffer}
                      projectDetails={this.props.projectDetails}
                      user={this.props.user}
                      users={this.state.users}
                      selectAllArt={this.selectAllArt}
                      deselectAllArt={this.deselectAllArt}
                      deleteCurrentProject={this.props.deleteCurrentProject}
                      renameCurrentProject={this.props.renameCurrentProject}
                      currentProject={this.props.currentProject}
                      addNewProject={this.props.addNewProject}
                      changeProject={this.props.changeProject}
                      managerIsOpen={this.props.managerIsOpen}
                      manageNotesIsOpen={this.state.manageNotesIsOpen}
                      toggleManager={this.props.toggleManager}
                      toggleManageNotes={this.toggleManageNotes}
                      doQuery={this.doQuery}
                      projects={this.props.projects}
                      askToDeleteProject={this.askToDeleteProject}
                      sendToSnackbar={this.props.sendToSnackbar}
                   />
                <ManageNotesDialog
                    addNote={this.addNote}
                    removeNote={this.removeNote}
                    projectDetails={this.props.projectDetails}
                    toggleManageNotes={this.toggleManageNotes}
                    manageNotesIsOpen={this.state.manageNotesIsOpen}
                    updateNotes={this.updateNotes} />
                  <div
                      onClick     ={this.props.toggleNav}
                      onTouchTap  ={this.props.toggleNav}
                      className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ManagerMain");
        this.fetchAllUsers();
    }

    componentWillReceiveProps(nextProps){
        // When a user is initially created, it has no this.props.user
        // We call this.createNewUser() in App.jsx
        // When user is created in database, fetch new list of users
        if (nextProps.user != this.props.user) {
            this.fetchAllUsers();
        }
    }

    componentWillUnmount() {

    }

    // =============== Methods =====================

    /**
     * This method handles saving the strings from the notes manager of the
     * manager interface. Note are stored in the FB Database inside of the
     * project's object. Inside of projects/{project id}/notes/{curator uid} are
     * 2 types, public and private. Private just takes the string of the private note,
     * while public is an object  with the curators public note, display name,
     * and uid (which is also its key).
     * @param {Object} notes [has .collab and .personal
     * which are strings reflecting the 2 types of notes a curator
     * can leave in a project]
     */
    addNote = (notes) => {
        let publicNote   = notes.collab;
        let privateNote  = notes.personal;
        const project_id = this.props.currentProject[1];
        const uid = firebase.auth().currentUser.uid;
        let full_note = {
            note: publicNote,
            curator: this.props.user.public.display_name,
            uid:uid
        }

        let path = `projects/${project_id}/notes`;
        firebase.database().ref(path).transaction( (data)=>{
            if (!data) { // first note on project
                data = {};
                data[uid] = {} // curator's first note on project
            } else if (!data[uid]) {
                data[uid] = {}
            }
            if (full_note.note != "") {
                data[uid]["public"] = full_note;
                data[uid]["private"] = privateNote;
            } else {
                if(data[uid]["public"] != "") {
                    data[uid]["public"] = null;
                }
                data[uid]["private"] = privateNote;
            }
            return data;
        }).then(()=>{
            let message = "Your notes have been updated.";
            console.log(message);
            this.props.sendToSnackbar(message);
        });
    }

    /**
     * Sets this.state.users to be [uid,name] pairs.
     */
    fetchAllUsers = () => {
        let users = [];
        firebase.database().ref('users').once("value", (snapshot)=>{
            snapshot.forEach((childSnap)=>{
                let uid  = childSnap.child("uid").val();
                let name = childSnap.child("public/display_name").val();
                // console.log(uid);
                users.push([uid,name]);
            });
            this.setState({users:users});
        });
    }

    /**
    * This method sets the state.command to be "select",
    * just for an instant. This is then sent down the tree to
    * Artwork.jsx, where it can mutate the state of artwork.
     */
    selectAllArt = () => {
        this.setState({command:"select"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.props.fillBuffer();
    }
    deselectAllArt = () => {
        this.setState({command:"deselect"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.props.emptyBuffer();
    }

    /**
     * [askToDeleteProject description]
     * @param  {HTML Element} e [description]
     */
    askToDeleteProject = (collaborators, e) => {
        e.stopPropagation();
        confirm('Are you sure you want to delete this project?').then(
            () => {
                // Proceed Callback
                this.props.deleteCurrentProject(collaborators);
            }, () => {
                // Cancel Callback
                return;
            }
        );
    }

    /**
     * [detailArtwork description]
     * @param  {String} uid [description]
     */
    detailArtwork = (uid) => {
        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            let payload = {
                auth: idToken,
                uid: uid
            };

            $.ajax({
                url: 'detail',
                data: payload,
                dataType: 'json',
                cache: false,
                success: this.props.updateInfoArtwork
            });
        });
    }

    toggleManageNotes = () => {
        this.setState({
            manageNotesIsOpen: !this.state.manageNotesIsOpen
        })
    }

}
