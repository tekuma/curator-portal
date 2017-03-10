// Libs
import React                from 'react';
import firebase             from 'firebase';
import Snackbar             from 'material-ui/Snackbar';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
// Files
import CurationHeader from '../headers/CurationHeader';
import SearchMain     from '../search_manager/SearchMain';
import ManagerMain    from '../manage/ManagerMain';
import ReviewManager  from '../review/ReviewManager';
import HamburgerIcon  from '../headers/HamburgerIcon';
import HiddenNav      from '../nav/HiddenNav';
import Roles          from '../../constants/Roles';
import EditProfile    from '../edit_profile/EditProfile';
import EditProfileDialog   from '../edit_profile/EditProfileDialog';
import VerifyEmailDialog   from '../edit_profile/VerifyEmailDialog';
import ArtworkDetailBoxDialog   from '../artwork_manager/ArtworkDetailBoxDialog';

/**
 * Component Rendered following successful log in.
 */
export default class PostAuth extends React.Component {
    state = {
        managerIsOpen: true,
        navIsOpen    : false,
        editProfileDialogIsOpen: false,             // Used to track whether Edit Profile Dialog is open
        verifyEmailDialogIsOpen: false,             // Used to track whether Verify Email Dialog is open
        detailBoxIsOpen: false,                     // whether artwork detail box is open or not
        user           : {},
        role           : Roles.MANAGE,
        projects       : [],
        artworkBuffer  : [], // list of all 'selected' artworks
        currentProject : null, // ["Project Name", "ProjectID"]
        projectArtworks: [],
        projectDetails : {},
        command        : "", // used for controlling artworks
        currentError   : "",
        artworkInfo    : {uid: null, found: false} // Information display by more info pop-up
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----PostAuth");
    }

    render() {
        if (this.state.role == Roles.MANAGE) {
            return this.goToManage();
        } else if (this.state.role == Roles.SEARCH) {
            return this.goToSearch();
        } else if (this.state.role == Roles.REVIEW) {
            return this.goToReview();
        } else if (this.state.role == Roles.PROFILE) {
            return this.goToEditProfile();
        } else {
            console.log("ROLE ERROR");
        }
    }

    componentDidMount() {
        console.log("++++++PostAuth");
        this.fetchProjects();
        this.fetchUserData();
        window.addEventListener("resize",this.rerender);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// =========== Flow Control =============

    goToSearch = () => {
        return(
            <div>
                <HiddenNav
                    user={this.state.user}
                    role={this.state.role}
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <div className={this.state.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                    <CurationHeader
                        artworkBuffer={this.state.artworkBuffer}
                        role={this.state.role}
                        changeAppLayout={this.changeAppLayout}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                    />
                    <HamburgerIcon
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <SearchMain
                        command={this.state.command}
                        role={this.state.role}
                        projects={this.state.projects}
                        managerIsOpen={this.state.managerIsOpen}
                        navIsOpen={this.state.navIsOpen}
                        toggleManager={this.toggleManager}
                        toggleNav={this.toggleNav}
                        currentProject={this.state.currentProject}
                        addNewProject={this.addNewProject}
                        changeProject={this.changeProject}
                        addArtworkToBuffer={this.addArtworkToBuffer}
                        removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                        addArtworksToProject={this.addArtworksToProject}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        updateInfoArtwork={this.updateInfoArtwork}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}  />
                        <ArtworkDetailBoxDialog
                            toggleDetailBox={this.toggleDetailBox}
                            detailBoxIsOpen={this.state.detailBoxIsOpen}
                            artworkInfo={this.state.artworkInfo}
                         />
                </div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Snackbar
                        className="snackbar-error"
                        open={this.state.currentError.length > 0}
                        message={this.state.currentError}
                        autoHideDuration={4000} />
                </MuiThemeProvider>
            </div>
        );
    }

    goToManage = () => {

        return(
            <div>
                <HiddenNav
                    user={this.state.user}
                    role={this.state.role}
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <div className={this.state.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                    <CurationHeader
                        artworkBuffer={this.state.artworkBuffer}
                        role={this.state.role}
                        changeAppLayout={this.changeAppLayout}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                    />
                    <HamburgerIcon
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <ManagerMain
                        command={this.state.command}
                        user={this.state.user}
                        artworkBuffer={this.state.artworkBuffer}
                        projectDetails={this.state.projectDetails}
                        createNewProject={this.props.createNewProject}
                        fetchProjects={this.fetchProjects}
                        projects={this.state.projects}
                        navIsOpen={this.state.navIsOpen}
                        managerIsOpen={this.state.managerIsOpen}
                        toggleManager={this.toggleManager}
                        toggleNav={this.toggleNav}
                        currentProject={this.state.currentProject}
                        addNewProject={this.addNewProject}
                        changeProject={this.changeProject}
                        projectArtworks={this.state.projectArtworks}
                        renameCurrentProject={this.renameCurrentProject}
                        deleteCurrentProject={this.deleteCurrentProject}
                        addArtworkToBuffer={this.addArtworkToBuffer}
                        removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                        fillBuffer={this.fillBuffer}
                        emptyBuffer={this.emptyBuffer}
                        changeAppLayout={this.changeAppLayout}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        role={this.state.role}
                        updateInfoArtwork={this.updateInfoArtwork}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}   />
                        <ArtworkDetailBoxDialog
                            toggleDetailBox={this.toggleDetailBox}
                            detailBoxIsOpen={this.state.detailBoxIsOpen}
                            artworkInfo={this.state.artworkInfo}
                         />
                </div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Snackbar
                        className="snackbar-error"
                        open={this.state.currentError.length > 0}
                        message={this.state.currentError}
                        autoHideDuration={4000} />
                </MuiThemeProvider>
            </div>
        );
    }

    goToReview = () => {

        return(
            <div>
                <HiddenNav
                    user={this.state.user}
                    role={this.state.role}
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <div className={this.state.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                    <CurationHeader
                        artworkBuffer={this.state.artworkBuffer}
                        role={this.state.role}
                        changeAppLayout={this.changeAppLayout}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                    />
                    <HamburgerIcon
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <ReviewManager
                        user={this.state.user}
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen}
                        sendToSnackbar={this.sendToSnackbar}
                         />
                </div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Snackbar
                        className="snackbar-error"
                        open={this.state.currentError.length > 0}
                        message={this.state.currentError}
                        autoHideDuration={4000} />
                </MuiThemeProvider>
            </div>
        );
    }

    goToEditProfile = () => {

        return (
            <div>
                <HiddenNav
                    user={this.state.user}
                    role={this.state.role}
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <div className={this.state.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                    <CurationHeader
                        artworkBuffer={this.state.artworkBuffer}
                        role={this.state.role}
                        changeAppLayout={this.changeAppLayout}
                        sendToSnackbar={this.sendToSnackbar}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        toggleDetailBox={this.toggleDetailBox}
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                    />
                    <HamburgerIcon
                        detailBoxIsOpen={this.state.detailBoxIsOpen}
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <div className="edit-profile-layout">
                        <EditProfile
                            user={this.state.user}
                            toggleProfileDialog={this.toggleProfileDialog}
                            toggleVerifyEmailDialog={this.toggleVerifyEmailDialog}
                            />
                    </div>
                    <EditProfileDialog
                    toggleProfileDialog={this.toggleProfileDialog}
                    editProfileDialogIsOpen={this.state.editProfileDialogIsOpen} />
                    <VerifyEmailDialog
                    toggleVerifyEmailDialog={this.toggleVerifyEmailDialog}
                    verifyEmailDialogIsOpen={this.state.verifyEmailDialogIsOpen} />
                    <div
                        onClick     ={this.toggleNav}
                        onTouchTap  ={this.toggleNav}
                        className   ={this.state.navIsOpen ? "site-overlay open" : "site-overlay"} />
                </div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Snackbar
                        className="snackbar-error"
                        open={this.state.currentError.length > 0}
                        message={this.state.currentError}
                        autoHideDuration={4000} />
                </MuiThemeProvider>
            </div>
        );
    }

// ============= Methods ===============

    /**
     * Helper method to force a re-rendering of this component
     */
    rerender = () => {
        this.setState({});
    }

    /**
     * This method is used by the Hamburger Icon component to
     * toggle the boolean value of this.state.navIsOpen
     * to change the state of the Hidden Navigation component
     * from open to closed.
     */
    toggleNav = () => {
        this.setState({
            navIsOpen: !this.state.navIsOpen,
            managerIsOpen: true
        });
    };

    /**
     * Gathers all data on currently logged in user, and stores it at
     * this.state.user
     */
    fetchUserData = () => {
        const uid  = firebase.auth().currentUser.uid;
        const path = `users/${uid}`;
        firebase.database().ref(path).on("value", (snapshot)=>{
            this.setState({
                user:snapshot.val()
            });
        });
    }

    /**
     * This method is used by the HiddenNav component and PostAuthHeader component
     * to switch the the layout currently being displayed in the Root App Layout component
     * by changing this.state.currentAppLayout.
     * The value can be: Views.UPLOAD, Views.ARTWORKS, and Views.PROFILE
     * @param  {A field of the Views object} view [View to be displayed]
     */
    changeAppLayout = (role) => {
        if(this.state.navIsOpen) {
            this.setState({
                navIsOpen: false,
                managerIsOpen: true,
                role:role,
                artworkBuffer   : []
            });
        } else {
            this.setState({
                managerIsOpen: true,
                role:role,
                artworkBuffer: []
            });
        }
    }


    /**
     * This method is used by the Search Manager Toggler element
     * to toggle the boolean value of this.state.managerIsOpen
     * to change the state of the the Album Manager component
     * from open to closed.
     */
    toggleManager = () => {
        this.setState({
            managerIsOpen: !this.state.managerIsOpen
        });
    };

    toggleDetailBox = () => {
        this.setState({
            detailBoxIsOpen: !this.state.detailBoxIsOpen
        });
    }

    updateInfoArtwork = (data) => {
        this.setState({artworkInfo: data});
    }

    /**
     * Gathers the list of projects that this user has access to, and passes
     * this list to fetchProjectsNames on callback.
     */
    fetchProjects = () => {
        let thisUID      = firebase.auth().currentUser.uid;
        let projectsPath = `users/${thisUID}/projects`;
        //NOTE use 'on' so that fetchProjects fires every time there is an update
        // which projects the user can see.
        firebase.database().ref(projectsPath).on('value', this.fetchProjectNames);
    }

    /**
     * Uses data passed from fetchProjects to fetch the names of each project, then updates
     * state.projects. This method has an async. for-loop
     */
    fetchProjectNames = (snapshot) => {
        if (snapshot.val()) {
            let projects = [];
            const projectIDs = snapshot.val()
            let callbacks = projectIDs.length;
            const leng = projectIDs.length;

            for (var i = 0; i < leng ; i++) {
                let projID = projectIDs[i];

                // make calls
                let path   = `projects/${projID}`;
                //NOTE: Use once, not on. On is called in the parent method.
                firebase.database().ref(path).once('value', (snapshot) => {
                    let data = snapshot.val();
                    let thisProj = [data.name,data.id];
                    projects.push(thisProj);
                    callbacks--;
                    if (callbacks === 0) {
                        if (!this.state.currentProject) {
                            //by default, set the first project as selected.
                            this.setState({
                                projects:projects,
                                currentProject:projects[0]
                            });
                        } else {
                            this.setState({
                                projects:projects
                            });
                        }
                        this.fetchProjectDetails();
                    }
                },(err)=>{
                    console.log(err);
                },this);
            }
        }
    }

    /**
     * Creates a new project, gives user rights to it, then updates current
     * project.
     */
    addNewProject = () => {
        let projectID   = this.props.createNewProject();
        let defaultName = "Untitled Project";
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

            let message = "New project created";
            console.log(message);
            this.sendToSnackbar(message);
        });
    }

    /**
     * Updates the value of this.state.currentProject
     * @param  {Array} newName [name , id]
     */
    changeProject = (newName) => {
        if (newName === null) {
            this.setState({
                currentProject  :"",
                projectArtworks :[],
                projects        :[],
                projectDetails  :{}
            });
        } else {
            let theProj = [newName.label,newName.id];
            this.setState({currentProject:theProj});
            setTimeout( ()=>{ // wait for state to update
                this.fetchProjectDetails();
            }, 50);
        }
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
            this.fetchProjects();
            setTimeout( ()=>{
                this.setState({currentProject:[newName,projectID]});
                this.fetchProjectDetails();
            }, 50);
        });
    }

    /**
     * - Deletes the current project from the /projects branch of firebase DB
     * - Deletes pointer to it from the user's branch
     * - Updates current project -> none
     * - deletes current project from /projects for each collaborator
     * @param  {2D Array} collaborators -> [[uid,display_name], ....]
     */
    deleteCurrentProject = (collaborators) => {
        const projectID = this.state.currentProject[1];
        let projPath  = `projects/${projectID}`;

        // Delete the project from projects branch
        firebase.database().ref(projPath).transaction((data)=>{
            return null;
        }).then(()=>{  // delete from the current users data
            let userUid   = firebase.auth().currentUser.uid;
            let userPath  = `users/${userUid}/projects`;
            firebase.database().ref(userPath).transaction((data)=>{
                if (data){
                    let index = data.indexOf(projectID);
                    if (index != -1) { // is actually there
                        data.splice(index,1);
                    }
                }
                return data;
            }).then(()=>{ // delete from each collaborators data
                for (let user of collaborators) {
                    let uid = user[0];
                    let path = `users/${uid}/projects`;
                    firebase.database().ref(path).transaction((data)=>{
                        if (data) {
                            let index = data.indexOf(projectID);
                            if (index != -1) { // is actually there
                                data.splice(index,1);
                            }
                        }
                        return data;
                    });
                }

                // Update the current project to an existing one
                if (this.state.projects.length > 1) {
                    let project = {label:this.state.projects[0][0], id:this.state.projects[0][1]};
                    this.changeProject(project);
                } else {
                    this.changeProject(null);
                }

                //Notify the user
                let message = "Project successfully deleted";
                console.log(message);
                this.sendToSnackbar(message);
            })
        });
    }

    /**
     * When called, will fetch all artworks from the Project
     * in the firebase database. Also initiates a listener, which
     * will reactively update any changes to artworks.
     */
    fetchProjectDetails = () => {
        if (this.state.currentProject) { // not null
            let projectID = this.state.currentProject[1];
            let path = `projects/${projectID}`;
            firebase.database().ref(path).on("value", (snapshot)=>{
                let art = [];
                let node = snapshot.val();
                if (node.artworks){
                    for (var key in node.artworks) { // obj -> array
                        if (node.artworks.hasOwnProperty(key)) {
                            art.push(node.artworks[key]);
                        }
                    }
                }
                this.setState({projectArtworks:art});
                this.setState({projectDetails:node});
            });
        }
    }

    /**
     * Will add the contents of this.state.artworkBuffer into the project
     * inside of the firebase DB.
     * Duplicates are ignored, and order is un-important.
     */
    addArtworksToProject = () => {
        firebase.database().ref(); // NOTE: initial request error
        let updates = this.state.artworkBuffer;
        let projectID  = this.state.currentProject[1]; // index 1 is the ID
        let projectRef = `projects/${projectID}`
        firebase.database().ref(projectRef).transaction((node)=>{
            if (!node.artworks) {
                node.artworks = {};
            }
            for (var i = 0; i < updates.length; i++) {
                let update = updates[i];
                let id = update.uid;
                node.artworks[id] = update;
            }
            return node;
        },()=>{
            console.log(">>Project Updated successfully");
            this.emptyBuffer();
        });
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
            this.emptyBuffer();
        });
    }


    /**
     * TODO
     * @param {[type]} artwork [description]
     */
    addArtworkToBuffer = (artworks) => {
        let buffer = this.state.artworkBuffer;
        buffer.push(artworks);
        this.setState({artworkBuffer:buffer});
    }

    removeArtworkFromBuffer = (artwork) => {
        let buffer = new Set(this.state.artworkBuffer);
        buffer.delete(artwork);
        let theBuffer = Array.from(buffer);
        this.setState({artworkBuffer:theBuffer});
    }

    fillBuffer = () => {
        let buffer = this.state.projectArtworks;
        this.setState({artworkBuffer:buffer});
    }

    emptyBuffer = () => {
        this.setState({command:"deselect"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.setState({artworkBuffer:[]});
    }

    /**
     * This method is used by the Edit Profile Layout page component
     * to toggle the boolean value of this.state.editProfileDialogIsOpen
     * to change the state of the the Edit Profile Dialog component
     * from open to closed.
     */
    toggleProfileDialog = () => {
        this.setState({
            editProfileDialogIsOpen: !this.state.editProfileDialogIsOpen
        });
    }

    /**
     * This method is used by the Verify Email button the Private Edit Profile page component
     * to toggle the boolean value of this.state.verifyEmailIsOpen
     * to change the state of the the Verify Email Dialog component
     * from open to closed.
     */
    toggleVerifyEmailDialog = () => {
        this.setState({
            verifyEmailDialogIsOpen: !this.state.verifyEmailDialogIsOpen
        });
    }

    sendToSnackbar = (message) => {
        this.setState({
            currentError: message
        });
        setTimeout(() => {
            this.setState({
                currentError: ""
            });
        }, 5000);   // Clear error once it has been shown
    }

}//EOF
