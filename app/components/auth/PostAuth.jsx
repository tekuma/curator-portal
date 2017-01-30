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
import ReviewManager    from '../review/ReviewManager';
import HamburgerIcon  from '../headers/HamburgerIcon';
import HiddenNav      from '../nav/HiddenNav';
import Roles          from '../../constants/Roles';
import EditProfile    from '../edit_profile/EditProfile';



/**
 * Component Rendered following successful log in.
 */
export default class PostAuth extends React.Component {
    state = {
        managerIsOpen: true,
        navIsOpen    : false,
        user         : {},
        role         : Roles.MANAGE,
        projects     : [],
        artworkBuffer  : [], // list of all 'selected' artworks
        currentProject : null, // ["Project Name", "ProjectID"]
        projectArtworks: [],
        projectDetails : {}
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----PostAuth");
    }

    render() {
        if (this.state.role == Roles.SEARCH) {
            return this.goToSearch();
        } else if (this.state.role == Roles.MANAGE) {
            return this.goToManage();
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
                        role={this.state.role}
                        currentProject={this.state.currentProject}
                        changeProject={this.changeProject}
                        addNewProject={this.addNewProject}
                        projects={this.state.projects}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        changeAppLayout={this.changeAppLayout}
                    />
                    <HamburgerIcon
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <SearchMain
                        role={this.state.role}
                        projects={this.state.projects}
                        managerIsOpen={this.state.managerIsOpen}
                        navIsOpen={this.state.navIsOpen}
                        toggleManager={this.toggleManager}
                        currentProject={this.state.currentProject}
                        changeProject={this.changeProject}
                        addArtworkToBuffer={this.addArtworkToBuffer}
                        removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                        addArtworksToProject={this.addArtworksToProject}  />
                </div>
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
                        role={this.state.role}
                        currentProject={this.state.currentProject}
                        changeProject={this.changeProject}
                        addNewProject={this.addNewProject}
                        projects={this.state.projects}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        changeAppLayout={this.changeAppLayout}
                    />
                    <HamburgerIcon
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <ManagerMain
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
                        addNewProject={this.addNewProject}
                        currentProject={this.state.currentProject}
                        projectArtworks={this.state.projectArtworks}
                        changeProject={this.changeProject}
                        renameCurrentProject={this.renameCurrentProject}
                        deleteCurrentProject={this.deleteCurrentProject}
                        addArtworkToBuffer={this.addArtworkToBuffer}
                        removeArtworkFromBuffer={this.removeArtworkFromBuffer}
                        fillBuffer={this.fillBuffer}
                        emptyBuffer={this.emptyBuffer}
                        changeAppLayout={this.changeAppLayout}  />
                </div>
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
                        role={this.state.role}
                        currentProject={this.state.currentProject}
                        changeProject={this.changeProject}
                        addNewProject={this.addNewProject}
                        projects={this.state.projects}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        changeAppLayout={this.changeAppLayout}
                    />
                    <HamburgerIcon
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <ReviewManager
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen}
                         />
                </div>
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
                        role={this.state.role}
                        currentProject={this.state.currentProject}
                        changeProject={this.changeProject}
                        addNewProject={this.addNewProject}
                        projects={this.state.projects}
                        deleteArtworksFromProject={this.deleteArtworksFromProject}
                        addArtworksToProject={this.addArtworksToProject}
                        changeAppLayout={this.changeAppLayout}
                    />
                    <HamburgerIcon
                        toggleNav={this.toggleNav}
                        navIsOpen={this.state.navIsOpen} />
                    <div className="edit-profile-layout">
                        <EditProfile
                            user={this.state.user}
                            toggleVerifyEmailDialog   ={this.props.toggleVerifyEmailDialog}
                            />
                    </div>
                    <div
                        onClick     ={this.props.toggleNav}
                        onTouchTap  ={this.props.toggleNav}
                        className   ={this.state.navIsOpen ? "site-overlay open" : "site-overlay"} />
                </div>
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

    fetchUserData = () => {
        const uid = firebase.auth().currentUser.uid;
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
                artworkBuffer: []
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
                    let data = snapshot.val()
                    let thisProj = [data.name,data.id];
                    projects.push(thisProj)
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
            console.log("Received Null");
            this.setState({
                currentProject:"",
                projectArtworks  :[]
            });
        } else {
            let theProj = [newName.label,newName.id];
            console.log(theProj, "kdkddkkdkdkdkdkdkdk");
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
     * Deletes the current project from the firebaseDB, removes it from
     * the user's projects, and updates the current project to none.
     */
    deleteCurrentProject = (e) => {
        let projectID = this.state.currentProject[1];
        let userUid   = firebase.auth().currentUser.uid;
        let userPath  = `users/${userUid}/projects`;
        firebase.database().ref(userPath).transaction((data)=>{
            let index = data.indexOf(projectID);
            data.splice(index,1);

            return data;
        }, ()=>{
            let projectRef = `projects/${projectID}`;
            firebase.database().ref(projectRef).remove();

            if(this.state.projects.length > 1) {
                let project = {label:this.state.projects[0][0], id:this.state.projects[0][1]};
                this.changeProject(project);
            } else {
                this.changeProject(null);
            }
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
                for (var key in node.artworks) { // obj -> array
                    if (node.artworks.hasOwnProperty(key)) {
                        art.push(node.artworks[key]);
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
        this.setState({artworkBuffer:[]});
    }

}//EOF
