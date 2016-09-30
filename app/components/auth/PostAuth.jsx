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

/**
 * a
 */
export default class App extends React.Component {
    state = {
        managerIsOpen: true
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
                <CurationHeader />
                <SearchResults />
                <SearchManager
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager} />

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

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// ============= Methods ===============

    rerender = () => {
        this.setState({});
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
