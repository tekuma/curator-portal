/*
 */

// Libs
import React              from 'react';
import Snackbar           from 'material-ui/Snackbar';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
// Files
import CurationHeader from '../headers/CurationHeader';
import ArtworkManager from '../artwork_manager/ArtworkManager';
import Artwork        from '../artwork_manager/Artwork';
import SearchManager  from '../search_manager/SearchManager';
import SearchResults  from '../search_manager/SearchResults';
import HamburgerIcon  from '../headers/HamburgerIcon';
import HiddenNav      from '../nav/HiddenNav';

/**
 * a
 */
export default class App extends React.Component {
    state = {
        managerIsOpen: true,
        queryString  : "",
        navIsOpen    : false,
        user         : {},

    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----PostAuth");
    }

    render() {
        return(
            <div>
                <HiddenNav
                    navIsOpen      ={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <HamburgerIcon
                    toggleNav={this.toggleNav}
                    navIsOpen={this.state.navIsOpen} />

                <SearchResults
                    queryString={this.state.queryString}
                    setQueryString={this.setQueryString }
                    navIsOpen={this.state.navIsOpen}
                />
                <SearchManager
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager}
                 />
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++App");
        window.addEventListener("resize", this.rerender);

        //LISTENER: listen for auth state changes
        firebase.auth().onAuthStateChanged( (currentUser)=>{
            if (currentUser) {
                this.setState({loggedIn: true});
            } else {
                this.setState({loggedIn: false});
            }
        });

        // Set user object
        // this.setState({
        //
        // });

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// ============= Methods ===============

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
    changeAppLayout = (view) => {
        if(this.state.navIsOpen) {
            this.setState({
                navIsOpen: false,
                managerIsOpen: true
            });
        } else {
            this.setState({
                managerIsOpen: true
            });
        }
    }

    /**
     * [setQueryString description]
     * @param {[type]} input [description]
     */
    setQueryString = (input) => {
        console.log(">>> Updating query string:", input);
        this.setState({queryString:input});
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

}//END App
