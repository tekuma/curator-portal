/*
 */

// Libs
import React              from 'react';
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
                    authenticateWithPassword={this.props.authenticateWithPassword}
                    errors={this.props.errors} />
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++PreAuth");
        window.addEventListener("resize", this.rerender);

    }



}//END App
