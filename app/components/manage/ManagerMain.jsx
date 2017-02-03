// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ProjectArtworkManager from '../artwork_manager/ProjectArtworkManager';
import ProjectManager from './ProjectManager';
import CurationHeader from '../headers/CurationHeader';
import confirm    from '../confirm_dialog/ConfirmFunction';
import ArtworkDetailBoxDialog   from '../artwork_manager/ArtworkDetailBoxDialog';
import ManageNotesDialog   from './ManageNotesDialog';


export default class ManagerMain extends React.Component {
    state = {
        manageNotesIsOpen:false, // whether popup is open or not
        detailBoxIsOpen  :false, // whether artwork detail box is open or not
        projectNotes     :[],  // gathered notes
        artworkInfo      :{},  // Information display by more info pop-up
        users            :[],  // list of [name,uid] pairs to populate collaborators
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
                      command={this.props.command}
                      projectArtworks={this.props.projectArtworks}
                      managerIsOpen={this.props.managerIsOpen}
                      addArtworkToBuffer={this.props.addArtworkToBuffer}
                      removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                      changeAppLayout={this.props.changeAppLayout}
                      projects={this.props.projects}
                      addNewProject={this.props.addNewProject}
                      detailArtwork={this.detailArtwork}
                      toggleDetailBox={this.toggleDetailBox}
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
                      managerIsOpen={this.props.managerIsOpen}
                      manageNotesIsOpen={this.state.manageNotesIsOpen}
                      toggleManager={this.props.toggleManager}
                      toggleManageNotes={this.toggleManageNotes}
                      changeProject={this.props.changeProject}
                      doQuery={this.doQuery}
                      projects={this.props.projects}
                      addNewProject={this.props.addNewProject}
                      onDelete={this.deleteProject}
                   />
                   <ArtworkDetailBoxDialog
                       toggleDetailBox={this.toggleDetailBox}
                       detailBoxIsOpen={this.state.detailBoxIsOpen}
                       artworkInfo={this.state.artworkInfo}
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
    }

    componentWillUnmount() {

    }

    // =============== Methods =====================

    /**
     *
     * @param {Object} notes [description]
     */
    addNote = (notes) => {
        let publicNote = notes.collab;
        let privateNote = notes.personal;
        let project_id = this.props.currentProject[1];
        let uid = firebase.auth().currentUser.uid;

        let full_note = {
            note: publicNote,
            curator: this.props.user.public.display_name,
            uid:uid
        }
        console.log(full_note);
        let path = `projects/${project_id}/notes`;
        firebase.database().ref(path).transaction( (data)=>{
            if (!data) {
                data = {};
                data[uid] = {}
            } else if (!data[uid]) {
                data[uid] = {}
            }
            data[uid]["public"] = full_note;
            data[uid]["private"] = privateNote;
            return data;
        });

    }

    /**
     * Sets this.state.users to be [uid,name] pairs.
     */
    fetchAllUsers = () => {
        let users = [];
        firebase.database().ref('users').once("value", (snapshot)=>{
            snapshot.forEach((childSnap)=>{
                console.log("callback");
                let uid  = childSnap.child("uid").val();
                let name = childSnap.child("public/display_name").val();
                console.log(uid);
                users.push([uid,name]);
            });
            console.log(users);
            this.setState({users:users});
        })
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
     * [deleteProject description]
     * @param  {HTML Element} e [description]
     */
    deleteProject = (e) => {
        e.stopPropagation();
        confirm('Are you sure you want to delete this project?').then(
            () => {
                // Proceed Callback
                this.props.deleteCurrentProject();
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
                success: this.updateInfoArtwork
            });
        });
    }

    toggleDetailBox = () => {
        this.setState({
            detailBoxIsOpen: !this.state.detailBoxIsOpen
        })
    }
    toggleManageNotes = () => {
        this.setState({
            manageNotesIsOpen: !this.state.manageNotesIsOpen
        })
    }

}
