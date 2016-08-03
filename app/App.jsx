/*
 *  Root of Artist.tekuma.io: Web framework build on
 *  Firebase+ReactJS, written in JS ES6 compiled with babelJS,
 *  Bundled with webpack and NPM.
 *  written for Tekuma Inc, summer 2016 by:
 *  Stephen White and Afika Nyati
 */

// Libs
import React              from 'react';
import Snackbar           from 'material-ui/Snackbar';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin({
  shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
    return true;
  }
}); // Initializing to enable Touch Tap events. It is global

// Files
import CurationHeader from './components/headers/CurationHeader';
import ArtworkManager from './components/artwork_manager/ArtworkManager';
import Artwork from './components/artwork_manager/Artwork';
import SearchManager from './components/search_manager/SearchManager';

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
        console.log("-----App");
    }

    render() {
        return(
            <div>
                <CurationHeader />
                <SearchManager
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager} />
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++App");
        window.addEventListener("resize", this.rerender);

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
