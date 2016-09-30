/*
 */

// Libs
import React              from 'react';
import Snackbar           from 'material-ui/Snackbar';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
// Files
import PreAuthHeader from '../headers/PreAuthHeader';
import LandingPage   from './LandingPage'


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
        console.log("-----PreAuth");
    }

    render() {
        return(
            <div>
                <PreAuthHeader />
                <LandingPage
                    authenticateWithPassword={this.props.authenticateWithPassword} />
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++PreAuth");
        window.addEventListener("resize", this.rerender);

    }



}//END App
