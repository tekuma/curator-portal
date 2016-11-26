// Libs
import React                from 'react';
import firebase             from 'firebase';
import Snackbar             from 'material-ui/Snackbar';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
// Files
import CurationHeader from '../headers/CurationHeader';
import ArtworkManager from '../artwork_manager/ArtworkManager';
import Artwork        from '../artwork_manager/Artwork';
import SearchManager  from '../search_manager/SearchManager';
import SearchMain     from '../search_manager/SearchMain';
import HamburgerIcon  from '../headers/HamburgerIcon';
import HiddenNav      from '../nav/HiddenNav';
import ManagerMain    from '../manage/ManagerMain';


/**
 * Component Rendered following successful log in.
 */
export default class PostAuth extends React.Component {
    state = {
        managerIsOpen: true,
        navIsOpen    : false,
        user         : {},
        role         : "search",
        projects     : []
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----PostAuth");
    }

    render() {
        if (this.state.role === "search") {
            return this.goToSearch();
        } else {
            return this.goToManage();
        }
    }

    componentDidMount() {
        this.fetchProjects();
        console.log("++++++PostAuth");
        window.addEventListener("resize", this.rerender);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// =========== Flow Control =============

    goToSearch = () => {
        return(
            <div>
                <HiddenNav
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <HamburgerIcon
                    toggleNav={this.toggleNav}
                    navIsOpen={this.state.navIsOpen} />
                <SearchMain
                    projects={this.state.projects}
                    navIsOpen={this.state.navIsOpen}
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager}  />
            </div>
        );
    }

    goToManage = () => {
        return(
            <div>
                <HiddenNav
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <HamburgerIcon
                    toggleNav={this.toggleNav}
                    navIsOpen={this.state.navIsOpen} />
                <ManagerMain
                    projects={this.state.projects}
                    navIsOpen={this.state.navIsOpen}
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager}  />
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
     * This method is used by the HiddenNav component and PostAuthHeader component
     * to switch the the layout currently being displayed in the Root App Layout component
     * by changing this.state.currentAppLayout.
     * The value can be: Views.UPLOAD, Views.ARTWORKS, and Views.PROFILE
     * @param  {[A field of the Views object]} view [View to be displayed]
     */
    changeAppLayout = (role) => {
        if(this.state.navIsOpen) {
            this.setState({
                navIsOpen: false,
                managerIsOpen: true,
                role:role
            });
        } else {
            this.setState({
                managerIsOpen: true,
                role:role
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
        let thisUID    = firebase.auth().currentUser.uid;
        let projectsPath = `users/${thisUID}/projects`;
        firebase.database().ref(projectsPath).once('value',this.fetchProjectNames);
    }

    /**
     * Uses data passed from fetchProjects  to fetch the names of each project, then updates
     * state.projects.
     */
    fetchProjectNames = (snapshot) => {
        console.log("Fetching...");
        let projects = [];
        let projectIDs = snapshot.val()
        let leng = projectIDs.length;

        for (var i = 0; i < leng ; i++) {
            let projID = projectIDs[i];

            let callback;
            if (i === leng-1) { // if in last loop, pass special callback
                callback = (snapshot) => {
                    console.log("!!!!!!!!!!!");
                    let data = snapshot.val()
                    let thisProj = [data.name,data.id]
                    projects.push(thisProj)
                    // ids has all ids in order

                    this.setState({projects:projects});
                    console.log(this.state.projects, "SUCCESS");
                }
            } else {
                callback = (snapshot) => {
                    let data = snapshot.val()
                    let thisProj = [data.name,data.id]
                    projects.push(thisProj)
                }
            }

            // make calls
            let path   = `projects/${projID}`;
            firebase.database().ref(path).once('value', callback,(err)=>{
                console.log(err);
            });
        }
    }

}
